var express = require('express');
var app = express();
var Clinica = require('../models/clinica');
var Profesional = require('../models/profesional');
var Usuario = require('../models/usuario');
var ObraSocial = require('../models/obra-social');
var Paciente = require('../models/paciente');
var Ocupacion = require('../models/ocupacion');

/**
 * Busqueda especifica
 */
app.get('/coleccion/:coleccion/:termino', (req, res) => {
    var termino = req.params.termino;
    var regex = new RegExp(termino, 'i');
    var coleccion = req.params.coleccion;
    var prom;
    switch (coleccion) {
        case 'clinicas':
            prom = buscarClinicas(regex);
            break;

        case 'usuarios':
            prom = buscarUsuarios(regex);
            break;

        case 'profesionales':
            prom = buscarProfesionales(regex);
            break;
        case 'obrasSociales':
            prom = buscarObrasSociales(regex);
            break;
        case 'pacientes':
            prom = buscarPacientes(regex, termino);
            break;
        case 'ocupaciones':
            prom = buscarOcupaciones(regex, termino);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Solo se permite realizar busquedas por clinicas, usuarios, profesionales, obras-sociales, y pacientes'
            });
    }
    prom.then(resultado => {
        res.status(200).json({
            ok: true,
            [coleccion]: resultado
        });
    });
});

/**
 * Busqueda general
 */
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    Promise.all([
            buscarClinicas(regex),
            buscarProfesionales(regex),
            buscarUsuarios(regex),
            buscarPacientes(regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                clinicas: respuestas[0],
                profesionales: respuestas[1],
                usuarios: respuestas[2],
                pacientes: respuestas[3]
            });
        });

});

function buscarClinicas(regex) {
    return new Promise((resolve, reject) => {
        Clinica
            .find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, clinicas) => {
                if (err) {
                    reject('Error al cargar clinicas', err);
                } else {
                    resolve(clinicas);
                }
            });
    });
}

function buscarProfesionales(regex) {
    return new Promise((resolve, reject) => {
        Profesional
            .find()
            .or(
                [
                    { nombre: regex },
                    { apellido: regex }
                ]
            )
            .populate('usuario', 'nombre email')
            .populate('clinica')
            .exec((err, profesionales) => {
                if (err) {
                    reject('Error al cargar profesionales', err);
                } else {
                    resolve(profesionales);
                }
            });
    });
}

function buscarObrasSociales(regex) {
    return new Promise((resolve, reject) => {
        ObraSocial.find({ nombre: regex })
            .exec((err, obrassociales) => {
                if (err) {
                    reject('Error al cargar obras sociales', err);
                } else {
                    resolve(obrassociales);
                }
            });
    });
}

function buscarPacientes(regex, termino) {
    return new Promise((resolve, reject) => {
        Paciente.find()
            .or([
                { 'nombre': regex },
                { 'apellido': regex },
                { 'documento.numero': regex }
            ])
            .exec((err, pacientes) => {
                if (err) {
                    reject('Error al buscar pacientes', err);
                } else {
                    resolve(pacientes);
                }
            });
    });
}

function buscarOcupaciones(regex, termino) {
    return new Promise((resolve, reject) => {
        Ocupacion.find({ 'nombre': regex })
            .exec((err, ocupaciones) => {
                if (err) {
                    reject('Error al buscar ocupaciones', err);
                } else {
                    resolve(ocupaciones);
                }
            });
    });
}

function buscarUsuarios(regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role img')
            .or([
                { 'nombre': regex },
                { 'email': regex }
            ])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al buscar usuarios', err);
                } else {
                    resolve(usuarios);
                }

            });
    });
}
module.exports = app;