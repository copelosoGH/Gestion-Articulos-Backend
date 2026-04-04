const { Schema, model } = require("mongoose"); // importamos Schema y model de mogoose para poder hacer los modelos

const ArticuloSchema = Schema({ // disenamos modelo
    titulo: { //en todos colocalos en forma de objeto el tipo de dato y si es requerido o que debe tener por default
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    img: {
        type: String,
        default: "default.png"
    }
});

module.exports = model("Articulo", ArticuloSchema, "articulos"); // exportar modelo
                    // nombre del modelo, diseno modelo, coleccion de la bd (este ultimo es opcional) 