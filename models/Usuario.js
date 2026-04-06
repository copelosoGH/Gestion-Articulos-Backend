const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true  // no puede haber dos usuarios con el mismo email
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: "usuario"  // valores posibles: "usuario" o "admin"
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("Usuario", UsuarioSchema, "usuarios");