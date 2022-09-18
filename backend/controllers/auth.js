// Importación de módulos
const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');


// Función para validar el token
const token = async(req, res=response) => {
    
    const token = req.headers['x-token'];
    try {

        // Extraemos del token usando la palabra secreta el uid y el rol
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);
        // Creamos un nuevo nuevo token a partir del antiguo para que la fecha de expedición vaya renovándose
        const nuevoToken = await generarJWT(uid, rol);

        // También hay que validar si el usuario del que nos llega el token está en la base de datos, de esta forma si creamos tokens que no hayan sido generados por un usuario de la BD saltará el error
        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                // Es mejor no dar muchas explicaciones de lo que está pasando en temas de seguridad
                msg: 'Token no válido',
                token: ''
            });
        }

        return res.json({
            ok: true,
            msg: 'Token',
            token:nuevoToken
        });
        
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Token no válido',
            token: ''
        });
    }
}


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
            token: ''
        });
    }

    // Comparamos la contraseña del usuario recuperado con la contraseña que llega en la petición
    const validPassword = bcrypt.compareSync(password, usuarioBD.password);
    if (!validPassword) {
        return res.status(400).json({
        ok: false,
        msg: 'Usuario o contraseña incorrectos',
        token: ''
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
module.exports = { login, token }