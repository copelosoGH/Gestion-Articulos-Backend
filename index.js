// 1) require de express solicita a conexion de conexion.js
const { conexion } = require('./database/conexion');
const express = require('express');
const cors = require('cors');

// 2) verificar que conecto
console.log("App node arrancada");

// 3) ejecutar la conexion a la base de datos (asi de simple)
conexion();


// SERVIDOR NODE (se almacena en una variable la ejecución de express)
const app = express();
const puerto = 3900;

// CONFIGURAR CORS
app.use(cors()); // app.use permite configurar middlewares, en este caso cors

// CONVERTIR BODY A OBJETO JS
app.use(express.json()); // app.use permite configurar middlewares, en este caso express.json() para convertir el body a un objeto JS
app.use(express.urlencoded({extended:true})); // asi express recibe los datos en urlencode y los parsea a json

// SERVIDOR Y PETICIONES HTTP
app.listen(puerto, () => { //COLBACK que se ejecuta cuando el servidor está corriendo, en este caso para mostrar un mensaje en la consola
    console.log(`Servidor corriendo en el puerto ${puerto}`);
});


//RUTAS POSTA
const rutas_articulo = require("./routers/ArticuloRouter"); //colocamos en una constante el archivo de rutas

//cargar las rutas
app.use("/api", rutas_articulo);