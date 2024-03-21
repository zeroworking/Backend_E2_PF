import { Router } from "express";
import productManager from "../dao/productManager.js";
const router = Router();
const products = new productManager();
 
// RUTA PARA LISTAR LOS PRODUCTOS CON FILTRO POR CATEGORIA, LIMIT, PAGE, SORT
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const sort = req.query.sort;
    const category = req.query.category;
    let queryOptions = { limit, page, category };   
    if (sort) {
      queryOptions.sort = sort === 'asc' ? { price: 1 } : { price: -1 };
    }
    const result = await products.getAllProducts(queryOptions);
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/api/products_mongo?page=${result.prevPage}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/api/products_mongo?page=${result.nextPage}` : '';
    result.isValid = !(page < 1 || page > result.totalPages)
       
    res.json({
      message: "Lista de productos",
      data: result
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// RUTA PARA LISTAR UN PRODUCTO POR SU ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await products.getProductById(id);
        if (!product) {
            return res.status(404).send({ status: "error", message: "El producto no fue encontrado." });
        }
        res.status(200).json(product);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// RUTA PARA AGREGA UN PRODUCTO
router.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {
        const response = await products.saveProduct({title, description, code, price, status, stock, category, thumbnails});
        res.status(200).send({ status: "success", message: "El producto fue agregado correctamente." });        
    } catch (error) {
        console.log('Error al crear el producto', error);
    }
});

// RUTA PARA ACTUALIZAR UN PRODUCTO POR SU ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;    
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {        
        const existingProduct = await products.getProductById(id);
        if (!existingProduct) {
            return res.status(404).send({ status: "error", message: "El producto no fue encontrado." });
        }        
        const updatedProduct = { title, description, code, price, status, stock, category, thumbnails };
        const response = await products.updateProductById(id, updatedProduct);
        res.status(200).send({ status: "success", message: "El producto fue actualizado correctamente." });        
    } catch (error) {
        console.log("Error actualizando el producto", error);
        res.status(500).json({ message: "Error al actualizar el producto." });
    };
});

// RUTA PARA ELIMINAR UN PRODUCTO POR SU ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await products.getProductById(id);
        if (!product) {
            return res.status(404).send({ status: "error", message: "El producto no fue encontrado." });
        }
        const response = await products.deleteProductById(id);   
        res.status(200).send({ status: "success", message: "El producto fue eliminado correctamente." });
    } catch (error) {
        console.log("Error eliminando el producto", error);
        res.status(500).send({ status: "error", message: "Error eliminando el producto." });
    }
});

export default router;