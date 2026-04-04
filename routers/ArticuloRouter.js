const express = require("express"); //importamos express para utilzar el metodo de router
const router = express.Router(); // asignamos a una constante el medoto de router

const ArticuloController = require("../controllers/ArticuloController");

// RUTAS
//pruebas
router.get("/ruta-prueba", ArticuloController.prueba);
router.get("/hola", ArticuloController.hola);

//RUTAS POSTA
router.post("/crear", ArticuloController.crear)


module.exports = router;
