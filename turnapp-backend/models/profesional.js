var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var profesionalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellido: { type: String, required: [true, 'El apellido es necesario'] },
    matricula: { type: String, required: false },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    clinica: { type: Schema.Types.ObjectId, ref: 'Clinica', required: [true, 'La clínica es un campo obligatorio'] },
    profesion: { type: Schema.Types.ObjectId, ref: 'Profesion', required: [true, 'La profesión es un campo obligatorio'] },
    especialidades: [{ type: String, required: false }],
    cartaPresentacion: { type: String, required: false }
}, { collection: 'profesionales' });
module.exports = mongoose.model('Profesional', profesionalSchema);