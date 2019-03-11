var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var profesionSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    especialidades: [{
        nombre: { type: String, required: false }
    }],
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    activo: { type: Boolean, default: true }
}, { collection: 'profesiones' });

module.exports = mongoose.model('Profesion', profesionSchema);