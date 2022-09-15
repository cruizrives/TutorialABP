// Importación de módulos
const mongoose = require('mongoose');

// Creamos un objeto conexión:

// Al usar un await hay que indicar que esta función debe ser asíncrona
const dbConnection = async() => {
    try {

        // Como la conexión puede tardar usamos el await para que la aplicación espere a este bloque de código
        await mongoose.connect(process.env.DBCONNECTION, {

            // Modificadores para que la conexión funcione
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB online');

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la BD');
    }
}
// Exportamos el módulo para ser usado por terceros

module.exports = {
        dbConnection
    }