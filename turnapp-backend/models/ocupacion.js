var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ocupacionSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    activo: { type: Boolean, default: true }
}, { collection: 'ocupaciones' });

module.exports = mongoose.model('Ocupacion', ocupacionSchema);