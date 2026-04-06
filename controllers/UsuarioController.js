const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

// REGISTRO
const registro = async (req, res) => {
    try {
        const parametros = req.body;

        // VALIDAR DATOS
        if (!parametros.nombre || !parametros.email || !parametros.password) {
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos obligatorios"
            });
        }

        if (!validator.isEmail(parametros.email)) {
            return res.status(400).json({
                status: "error",
                mensaje: "El email no es válido"
            });
        }

        if (!validator.isLength(parametros.password, { min: 6 })) {
            return res.status(400).json({
                status: "error",
                mensaje: "La contraseña debe tener al menos 6 caracteres"
            });
        }

        // VERIFICAR QUE EL EMAIL NO EXISTA YA
        const usuarioExistente = await Usuario.findOne({ email: parametros.email });

        if (usuarioExistente) {
            return res.status(400).json({
                status: "error",
                mensaje: "Ya existe un usuario con ese email"
            });
        }

        // HASHEAR LA CONTRASEÑA
        // El 10 es el número de "salt rounds" — cuántas veces aplica el algoritmo
        // Más alto = más seguro pero más lento. 10 es el estándar
        const passwordHasheada = await bcrypt.hash(parametros.password, 10);

        // CREAR USUARIO
        const usuario = new Usuario({
            nombre: parametros.nombre,
            email: parametros.email,
            password: passwordHasheada,
            rol: parametros.rol || "usuario"
        });

        const usuarioGuardado = await usuario.save();

        // No devolver la contraseña en la respuesta
        usuarioGuardado.password = undefined;

        return res.status(201).json({
            status: "success",
            mensaje: "Usuario registrado correctamente",
            usuario: usuarioGuardado
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al registrar el usuario"
        });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // VALIDAR QUE LLEGUEN LOS DATOS
        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan el email o la contraseña"
            });
        }

        // BUSCAR EL USUARIO POR EMAIL
        // .select("+password") porque por defecto no lo traemos para mayor seguridad
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(404).json({
                status: "error",
                mensaje: "Usuario no encontrado"
            });
        }

        // COMPARAR CONTRASEÑA con el hash guardado en la BD
        const passwordCorrecta = await bcrypt.compare(password, usuario.password);

        if (!passwordCorrecta) {
            return res.status(401).json({
                status: "error",
                mensaje: "Contraseña incorrecta"
            });
        }

        // GENERAR TOKEN JWT
        // El token contiene el ID y el rol del usuario
        // process.env.JWT_SECRET es la clave secreta del .env
        // expiresIn: cuánto tiempo dura el token antes de expirar
        const token = jwt.sign(
            {
                id: usuario._id,
                email: usuario.email,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }  // dura 7 días
        );

        // No devolver la contraseña
        usuario.password = undefined;

        return res.status(200).json({
            status: "success",
            mensaje: "Login correcto",
            token,
            usuario
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al hacer login"
        });
    }
};

module.exports = {
    registro,
    login
};