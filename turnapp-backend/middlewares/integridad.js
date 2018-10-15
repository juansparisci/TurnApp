var mongoose = require('mongoose');
var Paciente = require('../models/paciente');
/**
 * Integridad referencial
 */

//Ocupacion
/**
 * Validar que la ocupación no esté referenciada por un paciente
 */
exports.verificaOcupacionPersona = function(req, res, next) {
    var id = req.params.id;
    Paciente.find({ 'ocupacion': mongoose.Types.ObjectId(id) })
        .exec((err, pacientes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar ocupación para validar que el paciente no posea la ocupación',
                    errors: err
                });
            }
            if (pacientes.length > 0) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La ocupación que intenta borrar se encuentra asociada a ' + pacientes.length + ' paciente' + (pacientes.length > 1 ? 's' : '') + '.',
                    errors: { message: 'La ocupación que intenta borrar se encuentra asociada a un paciente.' }
                });
            } else {
                next();
                return;
            }

        });
};