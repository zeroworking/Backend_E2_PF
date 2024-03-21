import { cartModel } from "./models/cart.model.js";
export default class cartManager {

// METODO PARA LISTAR TODOS LOS CARROS
  getCarts = async () => {
    try {      
      const carts = await cartModel.find().lean().exec();
      return carts;
    } catch (error) {
      console.error(`Error al intentar obtener los carritos: ${error}`);
    }
  };

// METODO PARA CREAR UN NUEVO CARRITO DE COMPRAS
  addCart = async () => {
    try {
      const newCart = await cartModel.create({ products: [] });
      return newCart;
    } catch (error) {
      console.error(`Error al intentar crear un nuevo carrito: ${error}`);
    }
  };

// METODO PARA LISTAR UN CARRO POR SU ID
  getCartById = async (id) => {
    try {
      const cart = await cartModel.findById(id).populate('products.product').lean().exec();
      return cart;
    } catch (error) {
      console.error(`Error al intentar obtener el carrito por su ID: ${error}`);
    }
  };

// METODO PARA AGREGAR UN PRODUCTO A UN CARRO EXISTENTE
  addProduct = async (cid, pid) => {
    const newProduct = { product: pid, quantity: 1 };
    try {
      const cart = await cartModel.findById(cid);
      const indexProduct = cart.products.findIndex((item) => item.product == pid);

      if (indexProduct < 0) {
        cart.products.push(newProduct);
      } else {
        cart.products[indexProduct].quantity += 1;
      }
      await cart.save();
      return cart;
    } catch (error) {
      console.error(`Error al intentar agregar un producto al carrito: ${error}`);
    }
  };

// METODO PARA ELIMINAR UN PRODUCTO DE UN CARRO EXISTENTE
  deleteProductToCart = async (cid, pid) => {
  try {
    const cart = await cartModel.findById(cid);
    const indexProduct = cart.products.findIndex((item) => item.product == pid);
    if (indexProduct >= 0) {      
      cart.products.splice(indexProduct, 1);
      await cart.save();
    } else {
      console.log('El producto especificado no se encuentra en el carrito.');
    }
    return cart;
  } catch (error) {
    console.error(`Error al intentar eliminar un producto del carrito: ${error}`);
  }
};

// METODO PARA AGREGAR O ACTUALIZAR UN PRODUCTO EN EL CARRO
updateProductQuantityToCart = async (cid, pid, quantity) => {
  try {
      const cart = await cartModel.findById(cid);
      const indexProduct = cart.products.findIndex(item => item.product == pid);
      if (indexProduct < 0) {
          console.error("El producto no existe en el carrito.");
          return null;
      } else {
          cart.products[indexProduct].quantity = quantity;
      }
      await cart.save();
      return cart;
  } catch (error) {
      console.error(`Error al intentar actualizar la cantidad del producto en el carrito: ${error}`);
  }
};

// METODO PARA ELIMINAR TODOS LOS PRODUCTOS DE UN CARRO EXISTENTE
deleteAllProductsFromCart = async (cid) => {
  try {
    const cart = await cartModel.findById(cid);
    if (cart) {
      cart.products = []; 
      await cart.save();
      return cart;
    } else {
      console.log('El carro especificado no se encuentra.');
      return null;
    }
  } catch (error) {
    console.error(`Error al intentar eliminar todos los productos del carro: ${error}`);
    return null;
  }
};

// METODO PARA ACTUALIZAR LOS PRODUCTOS DE CARRO
async updateCartWithProducts(cid, products) {
  try {
      // Busca el carrito por su ID
      const cart = await cartModel.findById(cid);      
      // Verifica si el carrito existe
      if (!cart) {
          throw new Error('El carrito especificado no existe');
      }      
      // Actualiza los productos del carrito con los nuevos productos proporcionados
      cart.products = products;      
      // Guarda el carrito actualizado en la base de datos
      await cart.save();      
      return cart; // Retorna el carrito actualizado
  } catch (error) {
      // Mejora el mensaje de error proporcionando información más útil
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
  }
}


} 