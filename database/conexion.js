const mongoose = require('mongoose');

const conexion = async () => {
    try {

        await mongoose.connect("mongodb://localhost:27017/mi_blog")

        console.log('Conexión a la base de datos establecida');

    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar a la base de datos');
    }
}

module.exports = {
    conexion
}