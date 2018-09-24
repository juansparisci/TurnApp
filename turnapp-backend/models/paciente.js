var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pacienteSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    documento: {
        tipo: { type: String, required: true },
        numero: { type: Number, required: true }
    },
    img: { type: String, required: false },
    telefono: { type: String, required: [true, 'El telefono es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
}, { collection: 'pacientes' });
module.exports = mongoose.model('Paciente', pacienteSchema);