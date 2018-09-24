var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var obraSocialSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    planes: [{
        nombre: { type: String, required: true }
    }],
    activo: { type: Schema.Types.Boolean, default: true },
    version: [{
        usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
        vr: { type: Schema.Types.Number, default: 0 },
        stamp: { type: Schema.Types.Date, default: Date.now() },
        nombre: { type: String },
        activo: { type: Schema.Types.Boolean, default: true }
    }]
}, { collection: 'obras-sociales' });
module.exports = mongoose.model('ObraSocial', obraSocialSchema);