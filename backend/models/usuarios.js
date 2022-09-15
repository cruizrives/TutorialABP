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

// Exportamos un modelo del esquema para poder trabajar con él
module.exports = model('Usuario', UsuarioSchema);