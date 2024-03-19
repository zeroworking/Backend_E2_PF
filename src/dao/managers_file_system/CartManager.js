import { promises as fs } from 'fs';
import { ProductManager } from "./ProductManager.js";

const manager2 = new ProductManager();

export class CartManager {
    constructor() {
        this.carts = [];
        this.cartId = 1;
        this.DirPath = "./src/files";
        this.FilePath = this.DirPath + "/carrito.json";
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
            console.log("CartManager inicializado correctamente.");
        } catch (error) {
            console.error("Error al inicializar CartManager:", error);
        }
    }

// AGREGA PRODUCTO A CART
    async addProductToCart(cartId, productId) {
        try {
            const cartsData = await fs.readFile(this.FilePath, 'utf8');
            const carts = JSON.parse(cartsData);            
            const cart = carts.find(cart => cart.id === cartId);
            if (!cart) {
                throw new Error(`El carrito con ID ${cartId} no existe.`);
            }    
            const productsData = await fs.readFile(manager2.FilePath, 'utf8');
            const products = JSON.parse(productsData);
            const product = products.find(product => product.id === productId);
            if (!product) {
                throw new Error(`El producto con ID ${productId} no existe.`);
            }
            const productInCartIndex = cart.products.findIndex(p => p.id === productId);
            if (productInCartIndex !== -1) {                
                cart.products[productInCartIndex].quantity++;
            } else {
                cart.products.push({ id: productId, quantity: 1 });
            }
            await fs.writeFile(this.FilePath, JSON.stringify(carts, null, 2));    
            return "Operación completada exitosamente";
        } catch (error) {
            throw error;
        }
    }
    
// CREA NUEVO CART
async newCart() {
    try {
        let existingCarts = [];
        try {
            const data = await fs.readFile(this.FilePath, 'utf8');
            existingCarts = JSON.parse(data);
        } catch (readError) {
            console.error("Error al leer el archivo de carritos:", readError);
        }       
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2);        
        const newCart = { id, products: [] };        
        existingCarts.push(newCart);        
        await fs.writeFile(this.FilePath, JSON.stringify(existingCarts, null, 2));
        console.log("Carrito agregado.");
    } catch (error) {
        console.error("Error al agregar el carrito:", error.message);
    }
}

// LISTA LOS PRODUCTOS DE UN CART POR ID
async productsByCart(cartId) {
    try {
        const cartsData = await fs.readFile(this.FilePath, 'utf8');
        const carts = JSON.parse(cartsData);
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) {
            throw new Error('No se encontró el carro con el ID especificado.');
        }
        return cart.products;
    } catch (error) {
        throw error;
    }
}

}