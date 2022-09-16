// Importación de módulos
const Usuario = require('../models/usuarios');
const bcrypt = require('bcryptjs');

// Crea una función que recibe un request y envía un response, la marcamos como async porque después es muy probable que necesitemos que esta espere a resolverse
const obtenerUsuarios = async(req, res) => {

    // Buscamos en todos los registros de usuarios de la base de datos y los devolvemos
    const usuarios = await Usuario.find({}, "nombre");
    res.json({
        ok: true,
        msg: 'obtenerUsuarios',
        // Podemos resumirlo en usuarios ya que creamos un campo con el mismo nombre que la variable que almacena los registros de usuarios
        usuarios: usuarios
    });
}

// Función para crear usuario que envíe respuesta
// Comprobamos los errores de validación de forma genérica usando el middleware en el router para evitar tener que copiar el código por cada método de comprobación de errores
const crearUsuario = async (req, res) => {

// Comprobar si el email ya existe
// Obtenemos los valores necesarios del body mediante destructuración, esto sería lo mismo que const email = req.body.email
const { email, password, rol } = req.body;

try {

    // Buscamos si encuentra el email enviado en la base de datos 
    const existeEmail = await Usuario.findOne({ email: email });

    // Comprobamos si existe el usuario mediante el email (clave primaria)
    if (existeEmail) {
        return res.status(400).json({
        ok: false,
        msg: 'Email ya existe'
        });
    }

    // Comprobamos si el rol enviado en el caso de que exista es correcto
    if (rol && rol != 'alumno' && rol != 'profesor' && rol != 'admin'){
        return res.status(400).json({
            ok: false,
            msg: 'Rol incorrecto'
            });
    }

    // Ciframos la contraseña
    // Generamos un salt, una cadena aleatoria
    const salt = bcrypt.genSaltSync(); 
    // Ciframos la contraseña
    const cpassword = bcrypt.hashSync(password, salt); 

    // Guardamos el usuario en la bd, utilizando el modelo usuario de la base de datos y haciendo uso del body de la petición para llamar a su constructor
    const usuario = new Usuario(req.body);
    usuario.password = cpassword;
    await usuario.save();
        
    // Enviamos la respuesta en el caso de que todo haya sido válido
    res.json({
        ok: true,
        msg: 'crearUsuario',
        usuario
    })
    
} catch (error) {
    console.log(error);
    return res.status(400).json({
        ok:false,
        msg:'Error creando usuario'
    })

}
}

// Función para actualizar el usuario
const actualizarUsuario = async(req, res) => {
    res.json({
        ok: true,
        msg: 'actualizarUsuario'
    });
}

// Función para borrar el usuario
const borrarUsuario = async(req, res) => {
    res.json({
        ok: true,
        msg: 'borrarUsuario'
    });
}

// Exportamos la función para usarla en routes
module.exports = { obtenerUsuarios, crearUsuario, actualizarUsuario, borrarUsuario  }