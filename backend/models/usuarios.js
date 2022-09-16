// Importación de módulos cargando schema y model con destructuración
const { Schema, model } = require('mongoose');

// Esquema de la base de datos
const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    imagen: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        default: 'ALUMNO'
    },

// Indica el nombre de la colección en la base de datos
}, { collection: 'usuarios' });

// Reescribimos el método encargado de escribir el contenido del modelo en JSON para evitar que la contraseña llegue al frontend
UsuarioSchema.method('toJSON', function() {

    // Se extraen las propiedades v id y password y se dejan el resto en el objeto object
    // Convertimos instancia usuario en un objeto que contiene todo lo que no hemos extraído
    const { __v, _id, password, ...object } = this.toObject();

    // Al object se le establece el parámetro uid con el id obtenido y se devuelve
    object.uid = _id;
    return object;
})

// Exportamos un modelo del esquema para poder trabajar con él
module.exports = model('Usuario', UsuarioSchema);