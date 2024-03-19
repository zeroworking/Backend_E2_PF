import { Router } from "express";
import ProductManagerMongo from "../dao/manager_mongo_atlas/ProductManagerMongo.js";
const router = Router();

const products = new ProductManagerMongo();
 
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
    const result = await products.getAll(queryOptions);
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

// RUTA PARA LISTA UN PRODUCTO POR SU ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    console.log (id);
    try {
        const response = await products.getById(id);        
        res.json(response)
    } catch (error) {
        console.log("Error: ", error);
    }
});

// RUTA PARA AGREGA UN PRODUCTO
router.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {
        const response = await products.saveProduct({title, description, code, price, status, stock, category, thumbnails});
        res.json(response)
    } catch (error) {
        console.log('Error al crear el producto', error);
    }
});

// RUTA PARA ACTUALIZAR UN PRODUCTO POR SU ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;    
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {
        const newProduct = { title, description, code, price, status, stock, category, thumbnails };
        const response = await products.updateProduct(id, newProduct);
        res.json(response);
    } catch (error) {
        console.log(`Error actualizando el producto ${id}`, error);        
    };
});

// RUTA PARA ELIMINAR UN PRODUCTO POR SU ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await products.deleteProduct(id);
        res.json(response);
    } catch (error) {
        console.log("Error eliminado el producto", error);
    }
});

export default router;