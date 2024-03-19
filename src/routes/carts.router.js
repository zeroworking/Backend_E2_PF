import {Router} from 'express';
const router = Router();
import { CartManager } from '../dao/managers_file_system/CartManager.js';
const manager = new CartManager();

// RUTA PARA CONSULTAR PRODUCTOS DE UN CARRO POR SU ID
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = await manager.productsByCart(cartId);
        res.status(200).json(products);        
    } catch (error) {
        console.error("Hubo un error al obtener los productos del carro", error);
        res.status(500).send("Error interno del servidor");
    }
});

// RUTA PARA CREAR NUEVO CARRO
router.post('/', async (req, res) => {
    try {
        const carts = await manager.newCart();
        res.status(200).json({ mensaje: "Carro creado correctamente." });  
    } catch (error) {
        console.error("Hubo un error al crear el carro", error);
        res.status(500).send("Error interno del servidor");
    }
});

// RUTA PARA AGREGAR PRODUCTO UN CARRO
router.post('/:cid/product/:pid', async (req, res) => {
    try {        
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const carts = await manager.addProductToCart(cartId,productId);
        res.status(200).json({ mensaje: "Producto agregado correctamente al carro." });          
    } catch (error) {
        console.error("Hubo un error al agregar el producto al carro", error);
        res.status(500).send("Error interno del servidor");
    }
});

export default router;