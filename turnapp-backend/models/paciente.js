var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pacienteSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellido: { type: String, required: [true, 'El apellido es necesario'] },
    documento: {
        tipo: { type: String, required: true },
        numero: { type: String, required: true }
    },
    img: { type: String, required: false },
    obraSocial: { type: Schema.Types.ObjectId, ref: 'ObraSocial', required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    datosContacto: {
        telefono: { type: String, required: [true, 'El telefono es necesario'] },
        email: { type: String, required: false, validator: function(v) { return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; } }
    },
    fechaNacimiento: {
        type: Date,
        max: Date.now,
        required: [true, 'La fecha de nacimiento es necesaria.']
    },
    genero: { type: String, enum: ['Masculino', 'Femenino'], required: [true, 'El género es necesario.'] },
    ocupacion: { type: Schema.Types.ObjectId, ref: 'Ocupacion', required: [true, 'La ocupación es necesaria.'] }
}, { collection: 'pacientes' });
pacienteSchema.index({ 'documento.tipo': 1, 'documento.numero': 1 }, { unique: true });
module.exports = mongoose.model('Paciente', pacienteSchema);