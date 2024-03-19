import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io'
import productsRoutes from './routes/products.router.js';
import cartsRoutes from './routes/carts.router.js';
import viewRoutes from './routes/views.router.js';
import products_mongoRouter from './routes/products_mongo.router.js';
import carts_mongoRouter from './routes/carts_mongo.router.js';
import mongoose from 'mongoose';
import { chatModel } from './dao/models/chat_mongo.model.js';
import { ProductManager } from './dao/managers_file_system/ProductManager.js';

const manager = new ProductManager();

const app = express();
const PORT = 8080;

// MIDDLEWARE JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HANDLEBARS
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');

// ARCHIVOS ESTATICOS
app.use(express.static(__dirname + "/public"))

// RUTAS MONGO
app.use('/api/products_mongo',products_mongoRouter)
app.use('/api/carts_mongo',carts_mongoRouter)

// RUTAS FILESYSTEM
app.use('/api/products',productsRoutes)
app.use('/api/carts',cartsRoutes)

// RUTA VIEWS-HANDLEBARS
app.use('/', viewRoutes)

const httpServer = app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`);
})


// INSTANCIA DE SOCKET.IO
const socketServer = new Server(httpServer);

// MANEJO DE LA CONEXION WEBSOCKET
socketServer.on("connection", async (socket) => {
    console.log("Un usuario se ha conectado");
  
    // OBTIENE LOS MENSAJES DEL CHAT Y LOS EMITE A LOS CLIENTES
    try {
        const messages = await chatModel.find({});
        socket.emit("initialMessages", messages);
    } catch (error) {
        console.error(error);
    }
  
    // MANEJO DE NUEVO MENSAJE ENVIADO POR EL CLIENTE
    socket.on("chatMessage", async (data) => {
        const { user, mensaje } = data;
  
        // GUARDA EL MENSAJE EN LA BASE DE DATOS
        try {
            const newMessage = new chatModel({
                user,
                mensaje,
            });
            await newMessage.save();
  
            // EMITE EL MENSAJE A TODOS LOS CLIENTES
            socketServer.emit("chatMessage", newMessage);
        } catch (error) {
            console.error(error);
        }
    });

         // WEBSOCKET DELETE PRODUCT
         socket.on('msgDeleteProduct', async data => {
            await manager.deleteProduct(data); 
            const updatedProducts = await manager.getProduct();
            socketServer.emit('products', updatedProducts); 
         })
    
        // WEBSOCKET ADD PRODUCT
        socket.on('msgAddProduct', async (data) => {
            const { title, description, code, price, status = true , stock, category, thumbnails } = data;    
            await manager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
            const updatedProducts = await manager.getProduct();
            socketServer.emit('products', updatedProducts); 
        });

});

const URL_MONGO = 'mongodb+srv://ZeroWorking:wxYoVrR9Tcj89zIt@zeroworking.ihft1zn.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ZeroWorking'

const connectMongoDB = async()=>{
    try {
        mongoose.connect(URL_MONGO)
        console.log("Conectado con exito a MongoBD usando Mongoose"); 
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Mongoose: " + error);
        process.exit();             
    }
}

connectMongoDB();