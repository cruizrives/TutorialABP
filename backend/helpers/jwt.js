// Importación de módulos
const jwt = require('jsonwebtoken');

// Función para generar Jason web tokens
const generarJWT = (uid, rol) => {

    // Si la función dentro de la promesa no pueden ejecutarse al invocarla en un bloque try-catch, el error es recogido en el bloque catch
    // Estas son útiles ya que nos permiten devolver el éxito o el fracaso de una operación
    return new Promise((resolve, reject) => {

        const payload = {uid,rol}

        // Firmamos el payload con una clave y establecemos que expire en un día
        // El sign puede devolver un error o un token
        jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
}
module.exports = { generarJWT }