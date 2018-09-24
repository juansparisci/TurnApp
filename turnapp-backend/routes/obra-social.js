var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var ObraSocial = require('../models/obra-social');

/**
 * Obtener Obras Sociales
 */
app.get('/', (req, res, next) => {
    var desde = Number(req.query.desde) || 0;
    ObraSocial.find({})
        .exec(
            (err, obrassociales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando obras sociales',
                        errors: err
                    });
                }
                ObraSocial.count((errCount, counter) => {
                    if (errCount) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error contando obras sociales',
                            errors: errCount
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        obrassociales: obrassociales,
                        total: counter
                    });
                });
            });

});
/**
 * Crear Obra Social
 */
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var obraSocial = new ObraSocial({
        nombre: body.nombre,
        img: body.img
    });
    obraSocial.version.push({
        nombre: body.nombre,
        usuario: req.usuario._id
    });
    obraSocial.save((err, obraSocialGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la obra social',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            obraSocial: obraSocialGuardada,
            usuarioToken: req.usuario
        });
    });

});

/**
 * Eliminar Obra Social
 */
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    ObraSocial.findById(id, (err, obraSocialBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar obra social',
                errors: err
            });
        }
        if (!obraSocialBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La obra social con el id ' + id + ' no existe',
                errors: { message: 'No existe una obra social con ese id' }
            });
        }
        var latVer = obraSocialBorrada.version[obraSocialBorrada.version.length - 1];
        obraSocialBorrada.version.push({
            vr: latVer.vr + 1,
            activo: false,
            usuario: req.usuario._id,
            stamp: Date.now()
        });
        obraSocialBorrada.activo = false;
        obraSocialBorrada.save();
        res.status(200).json({
            ok: true,
            obraSocial: obraSocialBorrada
        });
    });
});
/**
 * Obtener Obra Social
 */
app.get('/:id', (req, res) => {
    var id = req.params.id;
    ObraSocial.findById(id)
        .exec((err, obraSocial) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar obra social',
                    errors: err
                });
            }
            if (!obraSocial) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La obra social con el id ' + id + ' no existe',
                    errors: { message: 'No existe una obra social con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                obraSocial: obraSocial
            });
        });
});
/**
 * Actualizar Obras Social
 */
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    ObraSocial.findById(id, (err, obraSocial) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar obra social',
                errors: err
            });
        }
        if (!obraSocial) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La obra social con el id ' + id + ' no existe',
                errors: { message: 'No existe una obra social con ese id' }
            });
        }
        obraSocial.nombre = body.nombre;
        obraSocial.img = body.img;
        obraSocial.activo = body.activo;
        var latVer = obraSocial.version[obraSocial.version.length - 1];
        obraSocial.version.push({
            nombre: obraSocial.nombre,
            vr: latVer.vr + 1,
            activo: obraSocial.activo,
            usuario: req.usuario._id,
            stamp: Date.now()
        });
        obraSocial.save((er, obraSocialGuardada) => {
            if (er) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar obra social',
                    errors: er
                });
            }
            res.status(200).json({
                ok: true,
                obraSocial: obraSocialGuardada
            });
        });

    });
});
/**
 *  Agregar Plan
 */
app.post('/plan/:idObraSocial', mdAutenticacion.verificaToken, (req, res) => {
    var idObraSocial = req.params.idObraSocial;
    var body = req.body;
    ObraSocial.findById(idObraSocial, (err, obraSocial) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar obra social',
                errors: err
            });
        }
        if (!obraSocial) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La obra social con el id ' + id + ' no existe',
                errors: { message: 'No existe una obra social con ese id' }
            });
        }
        obraSocial.planes.push({ nombre: body.nombre });
        obraSocial.save((er, obraSocialGuardada) => {
            if (er) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar obra social',
                    errors: er
                });
            }
            res.status(200).json({
                ok: true,
                plan: { nombre: body.nombre }
            });
        });

    });
});
/**
 *  Borrar Plan
 */
app.delete('/plan/:idObraSocial/:idPlan', mdAutenticacion.verificaToken, (req, res) => {
    var idObraSocial = req.params.idObraSocial;
    var idPlan = req.params.idPlan;
    ObraSocial.findById(idObraSocial, (err, obraSocial) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar obra social',
                errors: err
            });
        }
        if (!obraSocial) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La obra social con el id ' + id + ' no existe',
                errors: { message: 'No existe una obra social con ese id' }
            });
        }

        obraSocial.planes.splice(obraSocial.planes.findIndex(item => item._id === idPlan), 1);
        obraSocial.save((er, obraSocialGuardada) => {
            if (er) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar obra social',
                    errors: er
                });
            }
            res.status(200).json({
                ok: true
            });
        });

    });
});
module.exports = app;