async function AgregarProductoACarro(productID) {
  const cartID = "65fccb77ac17ebba4a2b45a0"; // ID del carrito

  const newProduct = { product: productID, quantity: 1 };
  try {
    const response = await fetch(`/api/carts/${cartID}/product/${productID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newProduct)
    });

    if (!response.ok) {
      throw new Error("Error al agregar el producto al carrito");
    }
    const cart = await response.json();    
    swal("¡Producto agregado!", `El producto ha sido agregado al carrito ${cartID}`, "success");
    console.log("Producto agregado al carrito:", cart);
  } catch (error) {    
    swal("¡Error!", "Ocurrió un error al agregar el producto al carrito.", "error");
    console.error("Error:", error);
  }
}
