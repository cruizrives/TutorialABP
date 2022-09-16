const { Schema, model } = require('mongoose');
const GrupoSchema = Schema({
    nombre: {
        type: String,
        require: true,
        unique: true
    },
    proyecto: {
        type: String
    },
    proyectodes: {
        type: String
    },
}, { collection: 'grupos' });

// Se extraen las propiedades v id y password y se dejan el resto en el objeto object
// Convertimos instancia usuario en un objeto que contiene todo lo que no hemos extraído
GrupoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})
module.exports = model('Grupo', GrupoSchema);