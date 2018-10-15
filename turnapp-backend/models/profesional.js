var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var profesionalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    clinica: { type: Schema.Types.ObjectId, ref: 'Clinica', required: [true, 'La clínica es un campo obligatorio'] }
}, { collection: 'profesionales' });
module.exports = mongoose.model('Profesional', profesionalSchema);