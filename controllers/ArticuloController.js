const validator = require("validator");
const Articulo = require("../models/Articulo");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../services/cloudinary");

const listarArticulos = async (req, res) => {
    try {
        const articulos = await Articulo.find({}); // ordenados del más nuevo al más viejo
 
        if (!articulos || articulos.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No hay articulos"
            });
        }
 
        return res.status(200).json({
            status: "success",
            cantidad: articulos.length,
            articulos
        });
 
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al listar articulos"
        });
    }
};
 
// OBTENER UNO POR ID
const obtenerArticulo = async (req, res) => {
    try {
        const id = req.params.id;
        const articulo = await Articulo.findById(id);
 
        if (!articulo) {
            return res.status(404).json({
                status: "error",
                mensaje: "No existe el articulo"
            });
        }
 
        return res.status(200).json({
            status: "success",
            articulo
        });
 
    } catch (error) {
        // Si el ID no tiene formato válido de MongoDB, Mongoose lanza CastError
        return res.status(400).json({
            status: "error",
            mensaje: "ID no válido"
        });
    }
};

const crearArticulo = async (req, res) => {

    // TOMAR PARAMETROS DEL POST
    let parametros = req.body;

    // VALIDAR DATOS
    try {

        let validar_titulo = !validator.isEmpty(parametros.titulo) &&
            validator.isLength(parametros.titulo, { min: 4 });

        let validar_contenido = !validator.isEmpty(parametros.contenido);

        if (!validar_titulo || !validar_contenido) {
            throw new Error("No es valido");
        }

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos"
        });
    }

    try {

        // CREAR OBJETO
        const articulo = new Articulo(parametros);

        // GUARDAR EN BD
        const articuloGuardado = await articulo.save();

        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Articulo guardado correctamente"
        });

    } catch (error) {

        return res.status(400).json({
            status: "error",
            mensaje: "No se guardo el articulo"
        });

    }
};

// ACTUALIZAR
const actualizarArticulo = async (req, res) => {
    try {
        const id = req.params.id;
        const parametros = req.body;
 
        // Validar que haya al menos un campo para actualizar
        if (!parametros || Object.keys(parametros).length === 0) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se enviaron datos para actualizar"
            });
        }
 
        // findByIdAndUpdate: busca por ID, aplica los cambios, y devuelve el documento ACTUALIZADO
        // { new: true } hace que devuelva el documento nuevo, no el viejo
        // runValidators: true hace que respete las validaciones del Schema al actualizar
        const articuloActualizado = await Articulo.findByIdAndUpdate(
            id,
            parametros,
            { new: true, runValidators: true }
        );
 
        if (!articuloActualizado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No existe el articulo"
            });
        }
 
        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado,
            mensaje: "Articulo actualizado correctamente"
        });
 
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Error al actualizar. Verificá el ID y los datos enviados"
        });
    }
};
 
// ELIMINAR
const eliminarArticulo = async (req, res) => {
    try {
        const id = req.params.id;
 
        const articuloEliminado = await Articulo.findByIdAndDelete(id);
 
        if (!articuloEliminado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No existe el articulo"
            });
        }
 
        return res.status(200).json({
            status: "success",
            articulo: articuloEliminado,
            mensaje: "Articulo eliminado correctamente"
        });
 
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Error al eliminar. Verificá el ID"
        });
    }
};
 
// SUBIR IMAGEN
const subirImagen = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: "error", mensaje: "No se subió ninguna imagen" });
        }

        // 1. Subir a Cloudinary (especificando la carpeta que ya creaste)
        const resultado = await cloudinary.uploader.upload(req.file.path, {
            folder: "gestion-articulos"
        });

        // 2. Eliminar el archivo temporal que multer dejó en /uploads
        // Esto es importante para no llenar el disco de Railway innecesariamente
        fs.unlinkSync(req.file.path);

        // 3. Actualizar el artículo con la URL segura que nos da Cloudinary
        const id = req.params.id;
        const articuloActualizado = await Articulo.findByIdAndUpdate(
            id,
            { img: resultado.secure_url },
            { new: true }
        );

        if (!articuloActualizado) {
            return res.status(404).json({ status: "error", mensaje: "No existe el artículo" });
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado,
            mensaje: "Imagen subida a la nube correctamente"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", mensaje: "Error al subir a Cloudinary" });
    }
};


module.exports = {
    crearArticulo,
    listarArticulos,
    obtenerArticulo,
    actualizarArticulo,
    eliminarArticulo,
    subirImagen
};