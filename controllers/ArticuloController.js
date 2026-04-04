const validator = require("validator");
const Articulo = require("../models/Articulo");

const prueba = (req, res) => {

    return res.status(200).json({
        mensaje: "metodo prueba artiulo controller"
    });
}

const hola = (req, res) => {

    return res.status(200).json({
        mensaje: "estas haciendo tu ruta sin mirar el curso, bien"
    });
}

const crear = async (req, res) => {

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

module.exports = {
    prueba,
    hola,
    crear
}