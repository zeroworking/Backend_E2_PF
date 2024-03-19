import {Router} from 'express';
const router = Router();
import { ProductManager } from '../dao/managers_file_system/ProductManager.js';
const manager = new ProductManager();

// RUTA PARA LISTAR TODOS LOS PRODUCTOS
router.get('/', async (req, res) => {
    try {
        const productos = await manager.getProduct();        
        res.status(200).json(productos);
    } catch (error) {
        console.error("Hubo un error al obtener los productos", error);
        res.status(500).send("Error interno del servidor");
    }
});

// RUTA PARA LISTAR UN LIMITE DE PRODUCTOS
router.get('/query', async (req, res) => {
    try {
        const datos = req.query;
        const limite = datos.limit;
        const productos = await manager.getProduct(limite)        
        res.status(200).json(productos);
    } catch (error) {
        console.error("Hubo un error al obtener los productos", error);
        res.status(500).send("Error. El producto no existe");
    }
});

// RUTA PARA LISTAR VER LOS DETALLES DE UN PRODUCTO SEGUN SU ID
router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;      
        const productos = await manager.getProductById(productId)        
        res.status(200).json(productos);
    } catch (error) {
        console.error("Hubo un error al obtener los productos", error);
        res.status(500).send("Error. El producto no existe");
    }
});

// RUTA PARA AGREGAR UN PRODUCTO
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status = true , stock, category, thumbnails } = req.body; 
        const productos = await manager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
        res.status(200).json({ mensaje: "Producto agregado correctamente." });        
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// RUTA PARA ACTUALIZAR UN PRODUCTO
router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        const updatedFields = { title, description, code, price, status, stock, category, thumbnails };
        const productos = await manager.getProductById(productId);
        if (!productId) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }
        await manager.updateProduct(productId, updatedFields);
        res.status(200).json({ mensaje: "Producto actualizado correctamente." });    
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar el producto." });
    }
});

// RUTA PARA BORRAR UN PRODUCTO
router.delete('/:pid', async (req, res) => {
    try {        
        const productId = req.params.pid;
        if (!productId) {
            return res.status(400).json({ error: "El ID del producto no es válido." });
        }
        await manager.deleteProduct(productId);
        res.status(200).json({ message: "Producto eliminado correctamente." });
    } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        res.status(500).json({ error: "Error interno del servidor al eliminar el producto." });
    }
});

export default router;