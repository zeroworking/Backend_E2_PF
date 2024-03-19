import { promises as fs } from 'fs';

export class ProductManager {
    constructor() {
        this.products = [];
        this.productId = 1;        
        this.DirPath = "./src/files";
        this.FilePath = this.DirPath + "/productos.json";
    }

    async initialize() {
        try {
            await fs.mkdir(this.DirPath, { recursive: true });
            const fileExists = await fs.access(this.FilePath)
                .then(() => true)
                .catch(() => false);
            if (!fileExists) {
                await fs.writeFile(this.FilePath, JSON.stringify([]));
            }
            console.log("ProductManager inicializado correctamente.");
        } catch (error) {
            console.error("Error al inicializar ProductManager:", error);
        }
    }

 //LISTA CANTIDAD DE PRODUCTOS FIJADOS POR LIMIT
    async getProduct(limit) {
        try {
            const data = await fs.readFile(this.FilePath, 'utf8');
            const products = JSON.parse(data);
            //console.log("Contenido del archivo Products.json:");
            if (limit) {
                const limitedProducts = products.slice(0, limit);
                console.log(limitedProducts);
                return limitedProducts;
            } else {
                //console.log(products);
                return products;
            }
        } catch (error) {
            console.error("Error al leer el archivo Products.json:", error);
            throw error;
        }
    }

//LISTA DETALLES DEL PRODUCTO POR SU ID
    async getProductById(id) {
        try {            
            if (!id) {
                throw new Error("El ID del producto proporcionado no es válido.");
            }    
            const data = await fs.readFile(this.FilePath, 'utf8');
            const products = JSON.parse(data);
            const product = products.find(product => product.id === (id));    
            if (!product) {
                throw new Error("Producto no encontrado en el archivo.");
            }    
            return product;
        } catch (error) {            
            throw error;
        }
    }

//AGREGA UN PRODUCTO VALIDANDO CAMPOS Y DUPLICIDAD DE ID
    async addProduct({ title, description, code, price, status, stock, category, thumbnails }) {
        try {
            const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
            this.validateRequiredFields({ title, description, code, price, status, stock, category });
            let existingProducts = [];
            try {
                const data = await fs.readFile(this.FilePath, 'utf8');
                existingProducts = JSON.parse(data);
            } catch (readError) {
                console.error("Error al leer el archivo de productos:", readError);
            }            
            const newProduct = { id, title, description, code, price, status, stock, category, thumbnails };
            existingProducts.push(newProduct);
            await fs.writeFile(this.FilePath, JSON.stringify(existingProducts, null, 2));
            console.log("Producto agregado.");
        } catch (error) {
            console.error("Error al agregar el producto:", error.message);
        }
    }

// ACTUALIZA LA INFORMACION DE UN PRODUCTO POR SU ID
    async updateProduct(productId, updatedFields) {
        try {
            if (!productId) {
                throw new Error("El ID del producto proporcionado no es válido.");
            }
            const data = await fs.readFile(this.FilePath, 'utf8');
            let products = JSON.parse(data);            
            const productIndex = products.findIndex(product => product.id === productId);
            if (productIndex === -1) {
                throw new Error("Producto no encontrado en la lista.");
            }
            const productToUpdate = { ...products[productIndex] };
            for (const field in updatedFields) {
                if (field !== 'id') {
                    productToUpdate[field] = updatedFields[field];
                }
            }
            products[productIndex] = productToUpdate;
            await fs.writeFile(this.FilePath, JSON.stringify(products));
            console.log("Producto actualizado.");
        } catch (error) {
            console.error("Error al actualizar el producto:", error.message);
            throw error;
        }
    }

// ELIMINA UN PRODUCTO POR SU ID
    async deleteProduct(productId) {
        try {
            if (!productId) {
                throw new Error("El ID del producto no es válido.");
            }
            const data = await fs.readFile(this.FilePath, 'utf8');
            let products = JSON.parse(data);
            const productToDeleteIndex = products.findIndex(product => product.id === productId);
            if (productToDeleteIndex === -1) {
                throw new Error("No se encontró ningún producto con el ID proporcionado.");
            }          
            const productToDelete = products[productToDeleteIndex];
            products.splice(productToDeleteIndex, 1);
            await fs.writeFile(this.FilePath, JSON.stringify(products));
            console.log("Producto eliminado:", productToDelete);
        } catch (error) {
            console.error("Error al eliminar el producto:", error.message);
            throw error;
        }
    }

// FUNCION CAMPOS OBLIGATORIOS
    validateRequiredFields({ title, description, code, price, status, stock, category }) {
        // Verificar que todos los campos requeridos estén presentes y no sean nulos o vacíos
        if (!title || !description || !code || !price || !status || !stock || !category) {
            throw new Error("Todos los campos son obligatorios.");
        }
    }
    
}