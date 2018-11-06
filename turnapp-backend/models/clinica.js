var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var clinicaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    urlId: { type: String, unique: true, required: [true, 'El id de url es necesario'] },
    img: { type: String, required: false },
    datosContacto: {
        required: false,
        type: {
            telefonos: {
                required: false,
                type: {
                    principal: { type: String, required: false }
                }
            },
            email: { type: String, required: false, validator: function(v) { return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; } }
        }
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'clinicas' });

module.exports = mongoose.model('Clinica', clinicaSchema);