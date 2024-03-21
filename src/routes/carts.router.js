import { Router } from "express";
const router = Router();
import cartManager from "../dao/cartManager.js";
const carts = new cartManager();

// RUTA PARA LISTAR TODOS LOS CARROS
router.get('/', async (req, res) => {
  try{
    const response = await carts.getCarts();
    res.status(200).json({ response });
  }catch(error){
    console.error("Hubo un error al intentar listar los carros", error);
    res.status(500).send("Error interno del servidor");
  };
});

// RUTA PARA CREAR NUEVO CARRO
router.post('/', async (req, res) => {
    try {
        const response = await carts.addCart();
        res.status(200).json({ mensaje: "Carro creado correctamente." });  
    } catch (error) {
        console.error("Hubo un error al crear el carro", error);
        res.status(500).send("Error interno del servidor");
    }
});

// RUTA PARA CONSULTAR PRODUCTOS DE UN CARRO POR SU ID
router.get('/:cid', async (req, res) => {
  try{
    const cid = req.params.cid;
    const cart = await carts.getCartById(cid);
    res.status(200).json({ cart });
  }catch(error){
    console.error("Hubo un error al listar el carro por su id", error);
    res.status(500).send("Error interno del servidor");
  };
});

// RUTA PARA AGREGAR UN PRODUCTO A UN CARRO
router.post('/:cid/product/:pid', async (req, res) => {
  try{
    const cid = req.params.cid;
    const pid = req.params.pid;
    const currentCart = await carts.addProduct(cid, pid);
    res.status(202).json(currentCart);
  }catch(error){
    console.error(`Error trying to add a product to cart: ${error}`);
    res.status(500).send(`Internal server error trying to add a product to cart: ${error}`);
  };
});

// RUTA PARA ELIMINAR UN PRODUCTO A UN CARRO
router.delete('/:cid/products/:pid', async (req, res) => {
  try{
    const cid = req.params.cid;
    const pid = req.params.pid;       
    const currentCart = await carts.deleteProductToCart(cid, pid);
    res.status(200).json({ mensaje: "Producto eliminado correctamente del carro." });  
  }catch(error){
    console.error("Hubo un error al eliminar el producto del carro", error);
    res.status(500).send("Error interno del servidor");
  };
});

// RUTA PARA ACTUALIZAR LA CANTIDAD DE UNIDADES DE UN PRODUCTO EN EL CARRO
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;    
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).send("La cantidad debe ser un número positivo.");
    }
    const updatedCart = await carts.updateProductQuantityToCart(cid, pid, quantity);
    res.status(200).json({ mensaje: "Cantidad de unidades del producto actualizada correctamente." });  
  } catch (error) {
    console.error("Hubo un error al intentar actualizar la cantidad de productos en el carro", error);
    res.status(500).send("Error interno del servidor");
  }
});

// RUTA PARA ELIMINAR TODOS LOS PRODUCTOS DE UN CARRO EXISTENTE
router.delete('/:cid', async (req, res) => {
  try{
    const cid = req.params.cid;          
    const currentCart = await carts.deleteAllProductsFromCart(cid);
    res.status(200).json({ mensaje: "Todos los productos fueron eliminados del carro." });  
  }catch(error){
    console.error("Hubo un error al eliminar los productos del carro", error);
    res.status(500).send("Error interno del servidor");
  };
});

// RUTA PARA ACTUALIZAR EL CARRITO CON UN ARREGLO DE PRODUCTOS
router.put('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const products = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ mensaje: "La propiedad 'products' debe ser un arreglo." });
    }  
    const updatedCart = await carts.updateCartWithProducts(cid, products);    
    res.status(200).json({ mensaje: "El carrito fue actualizado con éxito.", cart: updatedCart });
  } catch (error) {
    console.error("Hubo un error al actualizar el carrito", error);
    res.status(500).send("Error interno del servidor");
  }
});


export default router;