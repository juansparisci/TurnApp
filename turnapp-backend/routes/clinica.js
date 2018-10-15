 var express = require('express');
 var app = express();
 var mdAutenticacion = require('../middlewares/autenticacion');
 var Clinica = require('../models/clinica');

 /**
  * Obtener clinicas
  */
 app.get('/', (req, res, next) => {
     var desde = Number(req.query.desde) || 0;
     Clinica.find({})
         .populate('usuario', 'nombre email')
         .exec(
             (err, clinicas) => {
                 if (err) {
                     return res.status(500).json({
                         ok: false,
                         mensaje: 'Error cargando clinicas',
                         errors: err
                     });
                 }
                 Clinica.count({}, (errConteo, conteo) => {
                     if (errConteo) {
                         return res.status(500).json({
                             ok: false,
                             mensaje: 'Error en conteo de clinicas',
                             errors: errConteo
                         });
                     }
                     res.status(200).json({
                         ok: true,
                         clinicas: clinicas,
                         total: conteo
                     });
                 });


             });

 });

 // ==========================================
 // Obtener Clinica por ID
 // ==========================================
 app.get('/:id', (req, res) => {
     var id = req.params.id;
     Clinica.findById(id)
         .populate('usuario', 'nombre img email')
         .exec((err, clinica) => {
             if (err) {
                 return res.status(500).json({
                     ok: false,
                     mensaje: 'Error al buscar clinica',
                     errors: err
                 });
             }
             if (!clinica) {
                 return res.status(400).json({
                     ok: false,
                     mensaje: 'La clinica con el id ' + id + 'no existe',
                     errors: { message: 'No existe una clinica con ese ID' }
                 });
             }
             res.status(200).json({
                 ok: true,
                 clinica: clinica
             });
         });
 });

 /**
  * Crear clinica
  */
 app.post('/', mdAutenticacion.verificaToken, (req, res) => {
     var body = req.body;
     var clinica = new Clinica({
         nombre: body.nombre,
         img: body.img,
         usuario: req.usuario._id
     });
     clinica.save((err, clinicaGuardada) => {
         if (err) {
             return res.status(400).json({
                 ok: false,
                 mensaje: 'Error al crear la clinica',
                 errors: err
             });
         }
         res.status(201).json({
             ok: true,
             clinica: clinicaGuardada,
             usuarioToken: req.usuario
         });
     });

 });

 /**
  * Eliminar Clinica
  */
 app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
     var id = req.params.id;
     Clinica.findByIdAndRemove(id, (err, clinicaBorrada) => {
         if (err) {
             return res.status(500).json({
                 ok: false,
                 mensaje: 'Error al borrar clínica',
                 errors: err
             });
         }
         if (!clinicaBorrada) {
             return res.status(400).json({
                 ok: false,
                 mensaje: 'La clínica con el id ' + id + ' no existe',
                 errors: { message: 'No existe una clínica con ese id' }
             });
         }
         res.status(200).json({
             ok: true,
             clinica: clinicaBorrada
         });
     });
 });
 /**
  * Actualizar Clínica
  */
 app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
     var id = req.params.id;
     var body = req.body;
     Clinica.findById(id, (err, clinica) => {
         if (err) {
             return res.status(500).json({
                 ok: false,
                 mensaje: 'Error al buscar clínica',
                 errors: err
             });
         }
         if (!clinica) {
             return res.status(400).json({
                 ok: false,
                 mensaje: 'La clínica con el id ' + id + ' no existe',
                 errors: { message: 'No existe una clínica con ese id' }
             });
         }
         clinica.nombre = body.nombre;
         clinica.img = body.img;
         if (body.datosContacto) {
             clinica.datosContacto = body.datosContacto;
         }
         clinica.save((er, clinicaGuardada) => {
             if (er) {
                 return res.status(400).json({
                     ok: false,
                     mensaje: 'Error al actualizar clínica',
                     errors: er
                 });
             }
             res.status(200).json({
                 ok: true,
                 clinica: clinicaGuardada
             });
         });

     });
 });
 module.exports = app;