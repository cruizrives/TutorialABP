// Importación de módulos
const { Schema, model } = require('mongoose');

// Definición del esquema
const AsignaturaSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    nombreCorto: {
        type: String,
        require: true
    },
    curso: {
        type: Schema.Types.ObjectId,
        ref: 'Curso',
        require: true
    },
    profesores: [{
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    }]
}, { collection: 'asignaturas' });

// Sobrecarga del método toJSON
AsignaturaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})


// Exportando el modelo
module.exports = model('Asignatura', AsignaturaSchema);