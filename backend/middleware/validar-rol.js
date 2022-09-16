const { response } = require('express');
const rolesPermitidos = ['ALUMNO','PROFESOR', 'ADMIN'];

const validarRol = (req, res, next) => {
    const rol = req.body.rol;

    // Comprobamos si el rol enviado en el caso de que exista es correcto
    if (rol && !rolesPermitidos.includes(rol)){
        return res.status(400).json({
            ok: false,
            msg: 'Rol no permitido'
            });
    }
    next();
}

module.exports = { validarRol }
