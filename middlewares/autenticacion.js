const jwt = require("jsonwebtoken");

const autenticacion = (req, res, next) => {
    try {
        // El token llega en el header Authorization con el formato:
        // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).json({
                status: "error",
                mensaje: "No se envió el token de autenticación"
            });
        }

        // Separamos "Bearer" del token real
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: "error",
                mensaje: "Formato de token inválido. Usá: Bearer <token>"
            });
        }

        // VERIFICAR EL TOKEN
        // Si el token es válido, decoded contiene lo que pusimos al generarlo:
        // { id, email, rol }
        // Si el token es inválido o expiró, jwt.verify lanza un error
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Guardamos los datos del usuario en req.usuario
        // para que los controllers puedan acceder a ellos
        req.usuario = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            status: "error",
            mensaje: "Token inválido o expirado"
        });
    }
};

module.exports = autenticacion;