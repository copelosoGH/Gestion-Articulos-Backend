const express = require("express"); //importamos express para utilzar el metodo de router
const router = express.Router(); // asignamos a una constante el medoto de router
const multer = require("multer");

const ArticuloController = require("../controllers/ArticuloController");

// CONFIGURACION DE MULTER (manejo de subida de archivos)
const storage = multer.diskStorage({
 
    // destination: carpeta donde se guardan las imágenes
    destination: (req, file, cb) => {
        cb(null, "./uploads/articulos/");
    },
 
    // filename: cómo se va a llamar el archivo guardado
    // usamos Date.now() para evitar nombres duplicados
    filename: (req, file, cb) => {
        cb(null, "articulo-" + Date.now() + "-" + file.originalname);
    }
});
 
const upload = multer({ storage });

// CRUD
router.get("/articulos", ArticuloController.listarArticulos);
router.get("/articulo/:id", ArticuloController.obtenerArticulo);
router.post("/articulo", ArticuloController.crearArticulo);
router.put("/articulo/:id",ArticuloController.actualizarArticulo);
router.delete("/articulo/:id", ArticuloController.eliminarArticulo);

// IMAGEN
router.post("/articulo/imagen/:id", upload.single("file0"), ArticuloController.subirImagen);
router.get("/articulo/imagen/:fichero", ArticuloController.obtenerImagen);

module.exports = router;
