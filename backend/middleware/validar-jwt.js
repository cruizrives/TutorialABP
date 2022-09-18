// Importación de módulos
const jwt = require('jsonwebtoken');

// Tipamos el método response para poder hacer uso de las recomendaciones de Vscode al usar el objeto res
// Con este método nos aseguramos de que el token recibido por el frontend sea correcto y no haya sufrido modificaciones, y además hacemos que rol y uid sean accesibles
const validarJWT = (req, res, next) => {

    // Extraemos el token de la cabecera x-token
    const token = req.header('x-token');
    
    if (!token) {
        return res.status(400).json({
            ok: false,
            msg: 'Falta token de autorización'
        });
    }

    // El método jwt.verify devuelve el payload decodificado siempre que la firma secreta sea correcta o el token haya caducado
    // Además vamos a extraer el id y el rol para que estos sean accesibles y certificados
    try {
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

        // Guardamos el uid y el rol en el objeto req para poder acceder a ellos fácilmente
        req.uid = uid;
        req.rol = rol;
        next();
    } catch (err) {
        return res.status(400).json({
            ok: false,
            msg: 'Token no válido'
        })
    }
}

module.exports = { validarJWT };