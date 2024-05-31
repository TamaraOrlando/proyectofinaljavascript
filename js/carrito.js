let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);


const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
const numerito = document.querySelector("#numerito");
const numeritoOffcanvas = document.querySelector("#numerito-offcanvas");




const cargarProductosCarrito = () => {
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = productosEnCarrito.map(({ imagen, titulo, cantidad, precio, id }) => `
            <div class="carrito-producto">
                <img class="carrito-producto-imagen" src="${imagen}" alt="${titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h2 class="carrito-producto-titgrande">${titulo}</h2>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${precio * cantidad}</p>
                </div>
                <button class="carrito-producto-btn carrito-producto-sumar"><i class="bi bi-arrow-up"></i></button>
                <button class="carrito-producto-btn carrito-producto-restar"><i class="bi bi-arrow-down"></i></button>
                <button class="carrito-producto-eliminar" id="${id}"><i class="bi bi-trash-fill"></i></button>
            </div>
        `).join("");

      
        document.querySelectorAll(".carrito-producto-sumar").forEach((btn, index) => {
            btn.addEventListener("click", () => sumarDelCarrito(productosEnCarrito[index]));
        });

        document.querySelectorAll(".carrito-producto-restar").forEach((btn, index) => {
            btn.addEventListener("click", () => restarDelCarrito(productosEnCarrito[index]));
        });

        
        actualizarBotonesEliminar();
        actualizarTotal();

    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
};


cargarProductosCarrito();


function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}


function eliminarDelCarrito(e) {

    const idBoton = e.currentTarget.id;
    const producto = productosEnCarrito.find(producto => producto.id === idBoton);


    Swal.fire({
        title: '¿Estás seguro/a que deseas eliminar este producto del carrito?',
        text: `Se van a eliminar ${producto.cantidad} productos del carrito.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000",
        cancelButtonColor: "rgba(34, 34, 34, 0.9)",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",

    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "¡Productos eliminados!",
                text: `Se eliminaron ${producto.cantidad} productos del carrito con éxito.`,
                icon: "success",
                confirmButtonColor: "#000"
            });

            const index = productosEnCarrito.findIndex(prod => prod.id === idBoton);

            productosEnCarrito.splice(index, 1);
            cargarProductosCarrito();

            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            actualizarNumerito();

        }
    });
}

botonVaciar.addEventListener("click", () => vaciarCarrito());

const vaciarCarrito = () => {
    Swal.fire({
        title: '¿Estás seguro/a que deseas vaciar el carrito?',
        text: `Se van a eliminar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        icon: "warning",
        iconColor: '#3434349c',
        showCancelButton: true,
        confirmButtonColor: "#000",
        cancelButtonColor: "rgba(34, 34, 34, 0.9)",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "¡Productos eliminados!",
                text: `Se eliminaron ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos del carrito con éxito.`,
                icon: "success",
                iconColor: '#3434349c',
                confirmButtonColor: "#000"
            });

            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
            actualizarNumerito();
        }
    });
};


function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", () => comprarCarrito());

const comprarCarrito = () => {

    Swal.fire({
        title: '¿Estás seguro/a que deseas comprar el carrito?',
        text: `Se van a comprar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        icon: "question",
        iconColor: '#8FBC8F',
        showCancelButton: true,
        confirmButtonColor: '#8FBC8F',
        cancelButtonColor: "rgba(34, 34, 34, 0.9)",
        confirmButtonText: "Comprar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "¡Productos comprados! Muchas gracias",
                text: `Se compraron ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos del carrito con éxito.`,
                icon: "success",
                iconColor: '#8FBC8F',
                confirmButtonColor: "#000"
            });

            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        
            contenedorCarritoVacio.classList.add("disabled");
            contenedorCarritoProductos.classList.add("disabled");
            contenedorCarritoAcciones.classList.add("disabled");
            contenedorCarritoComprado.classList.remove("disabled");
        
            actualizarNumerito();

        }
    });
};



actualizarNumerito();


const restarDelCarrito = (producto) => {

    if (producto.cantidad !== 1) {
        Toastify({
            text: "Producto eliminado del carrito",
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
            onClick: function () { }
        }).showToast();


        producto.cantidad--;
        cargarProductosCarrito();
        actualizarNumerito();
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    }
}




const sumarDelCarrito = (producto) => {
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
        onClick: function () { }
    }).showToast();

    producto.cantidad++;
    cargarProductosCarrito();
    actualizarNumerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
    numeritoOffcanvas.innerText = nuevoNumerito;
}






