// Importación de módulos
const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');

// Función para hacer login
const login = async(req, res = response) => {


    const { email, password } = req.body;

    try {

    // Recuperamos el usuario con el email enviado, si no existe devolvemos error
    const usuarioBD = await Usuario.findOne({ email });
    if (!usuarioBD) {
        return res.status(400).json({
            ok: false,
            msg: 'Usuario o contraseña incorrectos',
            token
        });
    }

    // Comparamos la contraseña del usuario recuperado con la contraseña que llega en la petición
    const validPassword = bcrypt.compareSync(password, usuarioBD.password);
    if (!validPassword) {
        return res.status(400).json({
        ok: false,
        msg: 'Usuario o contraseña incorrectos',
        token
        });
    }

    // Invocamos la promesa para generar el token
    // A la función para generar el JWT le tenemos que pasar el id de la base de datos, el cual obtendremos del usuario validado y el rol
    const token = await generarJWT(usuarioBD._id, usuarioBD.rol);

    res.json({
        ok:true,
        msg:'login',
        token
    })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login',
            token
        });
    }

}
module.exports = { login }