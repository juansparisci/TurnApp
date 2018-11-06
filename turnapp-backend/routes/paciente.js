var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var Paciente = require('../models/paciente');

/**
 * Obtener Pacientes
 */
app.get('/', (req, res, next) => {
    var desde = Number(req.query.desde) || 0;
    Paciente.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, pacientes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando pacientes',
                        errors: err
                    });
                }
                Paciente.count((errCount, counter) => {
                    if (errCount) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error contando pacientes',
                            errors: errCount
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        pacientes: pacientes,
                        total: counter
                    });
                });
            });

});
/**
 * Crear Paciente
 */
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var paciente = new Paciente({
        nombre: body.nombre,
        apellido: body.apellido,
        genero: body.genero,
        ocupacion: body.ocupacion,
        fechaNacimiento: body.fechaNacimiento,
        img: body.img,
        usuario: req.usuario._id,
        documento: body.documento,
        datosContacto: body.datosContacto
    });
    paciente.save((err, pacienteGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el paciente',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            paciente: pacienteGuardado,
            usuarioToken: req.usuario
        });
    });

});

/**
 * Eliminar Paciente
 */
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Paciente.findByIdAndRemove(id, (err, pacienteBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar paciente',
                errors: err
            });
        }
        if (!pacienteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El paciente con el id ' + id + ' no existe',
                errors: { message: 'No existe un paciente con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            paciente: pacienteBorrado
        });
    });
});
/**
 * Obtener Paciente
 */
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Paciente.findById(id)
        .populate('usuario', 'nombre email img')
        .exec((err, paciente) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar paciente',
                    errors: err
                });
            }
            if (!paciente) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El paciente con el id ' + id + ' no existe',
                    errors: { message: 'No existe un paciente con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                paciente: paciente
            });
        });
});
/**
 * Actualizar Paciente
 */
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Paciente.findById(id, (err, paciente) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar paciente',
                errors: err
            });
        }
        if (!paciente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El paciente con el id ' + id + ' no existe',
                errors: { message: 'No existe un paciente con ese id' }
            });
        }
        paciente.nombre = body.nombre;
        paciente.apellido = body.apellido;
        paciente.documento = body.documento;
        paciente.datosContacto = body.datosContacto;
        paciente.img = body.img;
        paciente.fechaNacimiento = body.fechaNacimiento;
        paciente.genero = body.genero;
        paciente.ocupacion = body.ocupacion;
        paciente.save((er, pacienteGuardado) => {
            if (er) {
                var mensaje = 'Error al actualizar paciente';
                if (er.errors.fechaNacimiento) {
                    mensaje = "Por favor verifique la fecha de nacimiento.";
                }
                return res.status(400).json({
                    ok: false,
                    mensaje: mensaje,
                    errors: er
                });
            }
            res.status(200).json({
                ok: true,
                paciente: pacienteGuardado
            });
        });

    });
});
module.exports = app;