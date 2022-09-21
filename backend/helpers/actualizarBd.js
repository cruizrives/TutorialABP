const Usuario = require('../models/usuarios');
// Acceder al  sistema de archivos
const fs = require('fs');

// En cuanto hemos convertido la función en un tipo async, se nos devuelve una promesa
const actualizarBd = async(tipo, path, nombreArchivo, id) => {

    switch (tipo) {
        case 'fotoperfil':
        
        // Comparamos si el id es de un usuario
            const usuario = await Usuario.findById(id);

            if (!usuario){
                return false;
            }

            // Comprobamos si el usuario ya tiene una imagen
            const fotoVieja = usuario.imagen;
            const pathFotoVieja = `${path}/${fotoVieja}`;

            // path es /uploads/tipo/
            // pathFotoVieja es /uploads/tipo/nombre.extension
            
            // Si existe la imagen y hay nombre de archivo, borramos la foto vieja
            if (fotoVieja && fs.existsSync(pathFotoVieja)) {
                fs.unlinkSync(pathFotoVieja);
                // Borramos la imagen
            }


            // Guardamos el nombre de la imagen nueva en la bd
            usuario.imagen = nombreArchivo;
            await usuario.save();

            return true;

            break;

        case 'evidencia':
            return false;
            break;
    
        default:
            return false;
            break;
    }

    console.log(tipo, path, nombreArchivo, id);
}

module.exports = {actualizarBd}