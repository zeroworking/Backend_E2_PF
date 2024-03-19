const socket = io();

socket.on('products', (products) => {
  const productListContainer = document.getElementById('contenedordeproductos');
  productListContainer.innerHTML = '';
  products.forEach((product) => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('producto');
    productDiv.innerHTML = `
      <div>        
        <button class="btn btn-danger" onclick="eliminarProductoDom('${product.id}')">Eliminar</button>
        Id: ${product.id}
        Título: ${product.title}
        Descripción: ${product.description}
        Código: ${product.code}
        Precio: ${product.price}        
        Stock: ${product.stock}
        Categoría: ${product.category}
        Imágenes: ${product.thumbnails}  
        Estado: ${product.status}    
      </div>`;
    
    productDiv.innerHTML += '<br>';
    productListContainer.appendChild(productDiv);
        
  });
});

function eliminarProductoDom(id) {      
    socket.emit('msgDeleteProduct', id);
}

function sendData(data) {  
  socket.emit('msgAddProduct', data) 
}

document.getElementById('productForm').addEventListener('submit', function(event) {
  event.preventDefault();  
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const code = document.getElementById('code').value;
  const price = document.getElementById('price').value;
  const status = document.getElementById('status').value;
  const stock = document.getElementById('stock').value;
  const category = document.getElementById('category').value;
  const thumbnails = document.getElementById('thumbnails').value;

  const productData = {
    title: title,
    description: description,
    code: code,
    price: price,
    status: status,
    stock: stock,
    category: category,
    thumbnails: thumbnails
  };

  sendData(productData);  
  this.reset();
});