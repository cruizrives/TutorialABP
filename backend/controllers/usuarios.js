// Importación de módulos
const Usuario = require('../models/usuarios');

// Crea una función que recibe un request y envía un response, la marcamos como async porque después es muy probable que necesitemos que esta espere a resolverse
const getUsuarios = async(req, res) => {

    // Buscamos en todos los registros de usuarios de la base de datos y los devolvemos
    const usuarios = await Usuario.find({}, "nombre");
    res.json({
        ok: true,
        msg: 'getUsuarios',
        // Podemos resumirlo en usuarios ya que creamos un campo con el mismo nombre que la variable que almacena los registros de usuarios
        usuarios: usuarios
    });
}

// Exportamos la función para usarla en routes
module.exports = { getUsuarios }