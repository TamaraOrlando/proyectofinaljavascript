// PRODUCTOS

let productos = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })



const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");
const numeritoOffcanvas = document.querySelector("#numerito-offcanvas");
const btnColorMode = document.querySelector("#color-mode");



const cargarProductos = (productosElegidos) => {
    contenedorProductos.innerHTML = productosElegidos.map(({ imagen, titulo, precio, id }) => `
        <div class="producto">
            <img class="producto-imagen" src="${imagen}" alt="${titulo}">
            <div class="producto-detalles">
                <h2 class="producto-titulo">${titulo}</h2>
                <p class="producto-precio">$${precio}</p>
                <button class="producto-agregar" id="${id}">Agregar al carrito</button>
            </div>
        </div>
    `).join("");

    actualizarBotonesAgregar();
};

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        const productosBoton = e.currentTarget.id !== "todos" 
            ? productos.filter(producto => producto.categoria.id === e.currentTarget.id) 
            : productos;

        cargarProductos(productosBoton);
    });
});


const actualizarBotonesAgregar = () => {
    const botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
};

let productosEnCarrito;

const productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}




const agregarAlCarrito = (e) => {
    Toastify({
        text: "Producto agregado al carrito",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "#222",
            borderRadius: "1rem",
            textTransform: "uppercase",
            fontSize: "1.5rem"
        },
        offset: {
            x: '2rem',
            y: '5rem'
        },
        onClick: () => {}
    }).showToast();
    
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    const productoExistente = productosEnCarrito.find(producto => producto.id === idBoton);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
};


function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
    numeritoOffcanvas.innerText = nuevoNumerito;
}




btnColorMode.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        btnColorMode.innerText = "🌙";
    } else {
        btnColorMode.innerText = "☀️";
    }
})

