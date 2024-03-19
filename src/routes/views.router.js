import {Router} from 'express';
import { ProductManager } from '../dao/managers_file_system/ProductManager.js';
import { productModel } from '../dao/models/product_mongo.model.js';
const router = Router();
const manager = new ProductManager();
import CartManagerMongo from "../dao/manager_mongo_atlas/CartManagerMongo.js";
const carts = new CartManagerMongo();

router.get('/carts/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await carts.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.render("carts", {
            style: "index.css",
            "products": cart["products"]            
          })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

router.get('/products', async (req, res) => {
    let page = parseInt(req.query.page);
    if (!page) page = 1
    let result = await productModel.paginate({}, { page, limit: 3, lean: true })
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
    result.isValid = !(page < 1 || page > result.totalPages)
    res.render('products', result)
})

router.get('/', async (req, res) => {
    try {
        const productos = await manager.getProduct(); 
        res.render('home',
            {
                style: "index.css",
                productos
            })
    } catch (error) {
        console.error("Hubo un error al obtener los productos", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const productos = await manager.getProduct(); 
        res.render('realtimeproducts',
            {
                style: "index.css",
                productos
            })
    } catch (error) {
        console.error("Hubo un error al obtener los productos", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/chat", (req, res) => {    
    res.render('chat',
            {
                style: "index.css",                
            })
  });

export default router;