// 1) require de express solicita a conexion de conexion.js
require("dotenv").config();
const { conexion } = require('./database/conexion');
const express = require('express');
const cors = require('cors');
const path = require('path');

// 2) verificar que conecto
console.log("App node arrancada");

// 3) ejecutar la conexion a la base de datos (asi de simple)
conexion();

// SERVIDOR NODE (se almacena en una variable la ejecución de express)
const app = express();
const puerto = process.env.PORT || 3900;

// CONFIGURAR CORS
app.use(cors()); // app.use permite configurar middlewares, en este caso cors

// CONVERTIR BODY A OBJETO JS
app.use(express.json()); // app.use permite configurar middlewares, en este caso express.json() para convertir el body a un objeto JS
app.use(express.urlencoded({extended:true})); // asi express recibe los datos en urlencode y los parsea a json

// CARPETA PUBLICA para servir imágenes estáticas
// Esto permite acceder a los archivos de /uploads desde el navegador
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Definicion de rutas
const rutas_articulo = require("./routers/ArticuloRouter");
const rutas_usuario  = require("./routers/UsuarioRouter");

// Carga de RUTAS
app.use("/api", rutas_articulo);
app.use("/api", rutas_usuario);


// SERVIDOR Y PETICIONES HTTP
app.listen(puerto, "0.0.0.0", () => { //COLBACK que se ejecuta cuando el servidor está corriendo, en este caso para mostrar un mensaje en la consola
    console.log(`Servidor corriendo en el puerto ${puerto}`);
});