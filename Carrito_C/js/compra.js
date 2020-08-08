const compra = new Carrito();
const listaCompra = document.querySelector("#lista-compra tbody");
const carrito = document.getElementById('carrito');
const procesarCompraBtn = document.getElementById('procesar-compra');
const cliente = document.getElementById('cliente');
const correo = document.getElementById('correo');


cargarEventos();


function cargarEventos() {
    document.addEventListener('DOMContentLoaded', compra.leerLocalStorageCompra());

    //Eliminar productos del carrito
    carrito.addEventListener('click', (e) => { compra.eliminarProducto(e) });

    compra.calcularTotal();

    //cuando se selecciona procesar Compra
    procesarCompraBtn.addEventListener('click', procesarCompra);

    carrito.addEventListener('change', (e) => { compra.obtenerEvento(e) });
    carrito.addEventListener('keyup', (e) => { compra.obtenerEvento(e) });

}

function procesarCompra() {
    // e.preventDefault();
    if (compra.obtenerProductosLocalStorage().length === 0) {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'No hay productos, selecciona alguno',
            showConfirmButton: false,
            timer: 2000
        }).then(function () {
            window.location = "index.html";
        })
    }
    else if (cliente.value === '' || correo.value === '') {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Ingrese todos los campos requeridos',
            showConfirmButton: false,
            timer: 2000
        })
    }
    else {

        //aqui se coloca el user id generado en el emailJS
        (function(){
            emailjs.init("user_HirnxhNSPmIN7mgQUXdfi");
         })();

        //El campo {{detalleCompra}} es el que se añadió en la plantilla de emailjs 
        /* 
        Hola {{destinatario}},

        Hemos recibido tu pedido de compra, en un plazo de 1 semana te enviaremos los productos solicitados.

        El monto total de su compra es : {{monto}}.

        {{detalleCompra}}


        Erick Cerna
        */

        /* AGREGAR DATOS DE FORMA RAPIDA A UN TEXT AREA */
        let cadena = "";
        productosLS = compra.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto) {
            cadena += `
                 Producto : ${producto.titulo}
                 Precio : ${producto.precio}
                 Cantidad: ${producto.cantidad}
                 
                `;
        });
        document.getElementById('detalleCompra').innerHTML = cadena;
        /* ------------------------- */

        var myform = $("form#procesar-pago");

        myform.submit(function(event){
            event.preventDefault();
        
          // Change to your service ID, or keep using the default service
          var service_id = "default_service";
          var template_id = "template_Yn2gQPBL";
        
          myform.find("button").text("Sending...");
          emailjs.sendForm(service_id,template_id,myform[0])
              .then(function(){ 
                alert("Sent!");
               myform.find("button").text("Send");
            }, function(err) {
               alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));
               myform.find("button").text("Send");
            });
          return false;
        });

    }
}

