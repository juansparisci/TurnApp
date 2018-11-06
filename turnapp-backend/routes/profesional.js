var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var Profesional = require('../models/profesional');

/**
 * Obtener Profesionales
 */
app.get('/', (req, res, next) => {
    var desde = Number(req.query.desde) || 0;
    Profesional.find({})
        .populate('usuario', 'nombre email')
        .populate('clinica')
        .exec(
            (err, profesionales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando profesionales',
                        errors: err
                    });
                }
                Profesional.count((errCount, counter) => {
                    if (errCount) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error contando profesionales',
                            errors: errCount
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        profesionales: profesionales,
                        total: counter
                    });
                });
            });

});
/**
 * Crear Profesional
 */
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var profesional = new Profesional({
        nombre: body.nombre,
        apellido: body.apellido,
        img: body.img,
        usuario: req.usuario._id,
        clinica: body.clinica
    });
    profesional.save((err, profesionalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el profesional',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            profesional: profesionalGuardado,
            usuarioToken: req.usuario
        });
    });

});

/**
 * Eliminar Profesional
 */
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Profesional.findByIdAndRemove(id, (err, profesionalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar profesional',
                errors: err
            });
        }
        if (!profesionalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El profesional con el id ' + id + ' no existe',
                errors: { message: 'No existe un profesional con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            profesional: profesionalBorrado
        });
    });
});
/**
 * Obtener Profesional
 */
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Profesional.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('clinica')
        .exec((err, profesional) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar profesional',
                    errors: err
                });
            }
            if (!profesional) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El profesional con el id ' + id + ' no existe',
                    errors: { message: 'No existe un profesional con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                profesional: profesional
            });
        });
});
/**
 * Actualizar Profesional
 */
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Profesional.findById(id, (err, profesional) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar profesional',
                errors: err
            });
        }
        if (!profesional) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El profesional con el id ' + id + ' no existe',
                errors: { message: 'No existe un profesional con ese id' }
            });
        }
        profesional.nombre = body.nombre;
        profesional.apellido = body.apellido;
        profesional.clinica = body.clinica;
        profesional.img = body.img;

        profesional.save((er, profesionalGuardado) => {
            if (er) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar profesional',
                    errors: er
                });
            }
            res.status(200).json({
                ok: true,
                profesional: profesionalGuardado
            });
        });

    });
});
module.exports = app;