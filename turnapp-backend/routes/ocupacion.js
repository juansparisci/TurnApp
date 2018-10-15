var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var mdIntegridad = require('../middlewares/integridad');
var Ocupacion = require('../models/ocupacion');

/**
 * Obtener ocupaciones
 */
app.get('/', (req, res, next) => {
    var desde = Number(req.query.desde) || 0;
    Ocupacion.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, ocupaciones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando ocupaciones',
                        errors: err
                    });
                }
                Ocupacion.count({}, (errConteo, conteo) => {
                    if (errConteo) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error en conteo de ocupaciones',
                            errors: errConteo
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        ocupaciones: ocupaciones,
                        total: conteo
                    });
                });


            });

});

// ==========================================
// Obtener Ocupacion por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Ocupacion.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, ocupacion) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar ocupacion',
                    errors: err
                });
            }
            if (!ocupacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La ocupacion con el id ' + id + 'no existe',
                    errors: { message: 'No existe una ocupacion con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                ocupacion: ocupacion
            });
        });
});

/**
 * Crear ocupacion
 */
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var ocupacion = new Ocupacion({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });
    ocupacion.save((err, ocupacionGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la ocupacion',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            ocupacion: ocupacionGuardada,
            usuarioToken: req.usuario
        });
    });

});

/**
 * Eliminar Ocupacion
 */
app.delete('/:id', [mdAutenticacion.verificaToken, mdIntegridad.verificaOcupacionPersona], (req, res) => {
    var id = req.params.id;

    Ocupacion.findByIdAndRemove(id, (err, ocupacionBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar ocupación',
                errors: err
            });
        }
        if (!ocupacionBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La ocupación con el id ' + id + ' no existe',
                errors: { message: 'No existe una ocupación con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            ocupacion: ocupacionBorrada
        });
    });
});
/**
 * Actualizar Ocupación
 */
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Ocupacion.findById(id, (err, ocupacion) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar ocupación',
                errors: err
            });
        }
        if (!ocupacion) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La ocupación con el id ' + id + ' no existe',
                errors: { message: 'No existe una ocupación con ese id' }
            });
        }
        ocupacion.nombre = body.nombre;
        ocupacion.img = body.img;
        if (body.datosContacto) {
            ocupacion.datosContacto = body.datosContacto;
        }
        ocupacion.save((er, ocupacionGuardada) => {
            if (er) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar ocupación',
                    errors: er
                });
            }
            res.status(200).json({
                ok: true,
                ocupacion: ocupacionGuardada
            });
        });

    });
});
module.exports = app;