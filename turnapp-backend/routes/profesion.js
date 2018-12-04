var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var mdIntegridad = require('../middlewares/integridad');
var Profesion = require('../models/profesion');
var fs = require('fs');

/**
 * Obtener profesiones
 */
app.get('/', (req, res, next) => {
    var desde = Number(req.query.desde) || 0;
    Profesion.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, profesiones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando profesiones',
                        errors: err
                    });
                }
                Profesion.count({}, (errConteo, conteo) => {
                    if (errConteo) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error en conteo de profesiones',
                            errors: errConteo
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        profesiones: profesiones,
                        total: conteo
                    });
                });


            });

});

// ==========================================
// Obtener Profesion por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Profesion.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, profesion) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar profesion',
                    errors: err
                });
            }
            if (!profesion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La profesion con el id ' + id + 'no existe',
                    errors: { message: 'No existe una profesion con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                profesion: profesion
            });
        });
});

/**
 * Crear profesion
 */
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var profesion = new Profesion({
        nombre: body.nombre,
        usuario: req.usuario._id
    });
    profesion.save((err, profesionGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la profesion',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            profesion: profesionGuardada,
            usuarioToken: req.usuario
        });
    });

});

/**
 * Eliminar Profesion
 */
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Profesion.findByIdAndRemove(id, (err, profesionBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar profesión',
                errors: err
            });
        }
        if (!profesionBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La profesión con el id ' + id + ' no existe',
                errors: { message: 'No existe una profesión con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            profesion: profesionBorrada
        });
    });
});
/**
 * Actualizar Profesión
 */
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Profesion.findById(id, (err, profesion) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar profesión',
                errors: err
            });
        }
        if (!profesion) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La profesión con el id ' + id + ' no existe',
                errors: { message: 'No existe una profesión con ese id' }
            });
        }
        profesion.nombre = body.nombre;
        profesion.save((er, profesionGuardada) => {
            if (er) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar profesión',
                    errors: er
                });
            }
            res.status(200).json({
                ok: true,
                profesion: profesionGuardada
            });
        });

    });
});

/**
 *  Agregar Especialidad
 */
app.post('/especialidad/:idProfesion', mdAutenticacion.verificaToken, (req, res) => {
    var idProfesion = req.params.idProfesion;
    var body = req.body;
    Profesion.findById(idProfesion, (err, profesion) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar profesion',
                errors: err
            });
        }
        if (!profesion) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La profesion con el id ' + id + ' no existe',
                errors: { message: 'No existe una profesion con ese id' }
            });
        }
        profesion.especialidades.push({ nombre: body.nombre, descripcion: body.descripcion });
        profesion.save((er, profesionGuardada) => {
            if (er) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar profesion',
                    errors: er
                });
            }
            res.status(200).json({
                ok: true,
                especialidad: profesion.especialidades[profesion.especialidades.length - 1]
            });
        });

    });
});

/**
 *  Acatualizar Especialidad
 */
app.put('/especialidad/:idProfesion/:idEspecialidad', mdAutenticacion.verificaToken, (req, res) => {
    var idProfesion = req.params.idProfesion;
    var idEspecialidad = req.params.idEspecialidad;
    var body = req.body;
    Profesion.findById(idProfesion, (err, profesion) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar profesión',
                errors: err
            });
        }
        if (!profesion) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La profesión con el id ' + id + ' no existe',
                errors: { message: 'No existe una profesión con ese id' }
            });
        }
        var esp = profesion.especialidades.id(idEspecialidad);
        if (!esp) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La especialidad con el id ' + idEspecialidad + ' no existe',
                errors: { message: 'No existe una especialidad con ese id' }
            });
        }
        esp.nombre = body.nombre;
        esp.descripcion = body.descripcion;
        profesion.save((er, profesionGuardada) => {
            if (er) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar profesión',
                    errors: er
                });
            }
            res.status(200).json({
                ok: true,
                profesion: profesionGuardada
            });
        });

    });
});
/**
 *  Borrar Especialidad
 */
app.delete('/especialidad/:idProfesion/:idEspecialidad', mdAutenticacion.verificaToken, (req, res) => {
    var idProfesion = req.params.idProfesion;
    var idEspecialidad = req.params.idEspecialidad;
    Profesion.findById(idProfesion, (err, profesion) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar profesion',
                errors: err
            });
        }
        if (!profesion) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La profesion con el id ' + id + ' no existe',
                errors: { message: 'No existe una profesion con ese id' }
            });
        }


        /**
         * Eliminar imagenes de especialidad a borrar
         */
        var especialidad = profesion.especialidades.id(idEspecialidad);
        especialidad.imgs.forEach(imgName => {
            var pathImg = './uploads/especialidades/' + imgName;
            if (fs.existsSync(pathImg)) {
                fs.unlink(pathImg, err => {});
            }
        });


        profesion.especialidades.splice(profesion.especialidades.findIndex(item => item._id === idEspecialidad), 1);

        profesion.save((er, profesionGuardada) => {
            if (er) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar profesion',
                    errors: er
                });
            }
            res.status(200).json({
                ok: true
            });
        });

    });
});

/**
 *  Obtener Especialidad
 */
app.get('/especialidad/:idProfesion/:idEspecialidad', mdAutenticacion.verificaToken, (req, res) => {
    var idProfesion = req.params.idProfesion;
    var idEspecialidad = req.params.idEspecialidad;
    Profesion.findById(idProfesion, (err, profesion) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar especialidad',
                errors: err
            });
        }
        if (!profesion) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La profesion con el id ' + idProfesion + ' no existe',
                errors: { message: 'No existe una profesion con ese id' }
            });
        }

        var esp = profesion.especialidades.id(idEspecialidad);
        if (!esp) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La especialidad con el id ' + idEspecialidad + ' no existe',
                errors: { message: 'No existe una especialidad con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            especialidad: esp
        });
    });

    //  });
});

module.exports = app;