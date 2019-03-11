var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var Usuario = require('../models/usuario');
var Profesional = require('../models/profesional');
var Profesion = require('../models/profesion');
var Clinica = require('../models/clinica');
var ObraSocial = require('../models/obra-social');
var Paciente = require('../models/paciente');

app.use(fileUpload());

// Rutas
app.put('/:tipo/:id', mdAutenticacion.verificaToken, (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Validar tipos de colecciones en las que se puede subir fotos
    var tiposValidos = ['profesionales', 'clinicas', 'usuarios', 'obras-sociales', 'pacientes', 'especialidades'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: { message: 'Tipo de colección no válida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó archivo',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validación de extención
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo.toLowerCase()) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    let nombreArchivo;
    let path;
    if (tipo === 'especialidades') {
        const idClinica = id.split('|')[0];
        nombreArchivo = `${ id.split('|')[1] + id.split('|')[2]  }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;
        // Mover el archivo del temporal a un path
        let carpeta = `./uploads/${ tipo }/${ idClinica }`;
        path = `${ carpeta }/${ nombreArchivo }`;

        if (!fs.existsSync(carpeta)) {
            fs.mkdirSync(carpeta);
        }
    } else {
        nombreArchivo = `${ id.replace(/\|/g,'') }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;
        // Mover el archivo del temporal a un path
        path = `./uploads/${ tipo }/${ nombreArchivo }`;
    }




    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);


    });


});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario no existe',
                    errors: { message: 'El usuario no existe' }
                });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
            //si ya existe imagen para el usuario la elimina
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => {});
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });

        });
    }

    if (tipo === 'profesionales') {
        Profesional.findById(id, (err, profesional) => {
            if (!profesional) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El profesional no existe',
                    errors: { message: 'El profesional no existe' }
                });
            }
            var pathViejo = './uploads/profesionales/' + profesional.img;
            //si ya existe imagen para el profesional la elimina
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => {});
            }
            profesional.img = nombreArchivo;
            profesional.save((err, profesionalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de profesional actualizada',
                    profesional: profesionalActualizado
                });
            });

        });
    }
    if (tipo === 'obras-sociales') {
        ObraSocial.findById(id, (err, obraSocial) => {
            if (!obraSocial) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La obra social no existe',
                    errors: { message: 'La obra social no existe' }
                });
            }
            var pathViejo = './uploads/obras-sociales/' + obraSocial.img;
            //si ya existe imagen para el obraSocial la elimina
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => {});
            }
            obraSocial.img = nombreArchivo;
            obraSocial.save((err, obraSocialActualizada) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de obra social actualizada',
                    obraSocial: obraSocialActualizada
                });
            });

        });
    }
    if (tipo === 'clinicas') {
        Clinica.findById(id, (err, clinica) => {
            if (!clinica) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La clinica no existe',
                    errors: { message: 'La clinica no existe' }
                });
            }
            var pathViejo = './uploads/clinicas/' + clinica.img;
            //si ya existe imagen para el clinica la elimina
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => {});
            }
            clinica.img = nombreArchivo;
            clinica.save((err, clinicaActualizada) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de clinica actualizada',
                    clinica: clinicaActualizada
                });
            });

        });
    }
    if (tipo === 'pacientes') {
        Paciente.findById(id, (err, paciente) => {
            if (!paciente) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El paciente no existe',
                    errors: { message: 'El paciente no existe' }
                });
            }
            var pathViejo = './uploads/pacientes/' + paciente.img;
            //si ya existe imagen para el paciente la elimina
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => {});
            }
            paciente.img = nombreArchivo;
            paciente.save((err, pacienteActualizada) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de paciente actualizada',
                    paciente: pacienteActualizada
                });
            });

        });
    }
    if (tipo === 'especialidades') {
        const idClinica = id.split('|')[0];
        const idProfesionAsignada = id.split('|')[1];
        const idEspecialidadAsignada = id.split('|')[2];

        Clinica.findById(idClinica, (err, clinica) => {
            if (!clinica) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La clínica no existe',
                    errors: { message: 'La clínica no existe' }
                });
            }
            const profesion = clinica.profesiones.id(idProfesionAsignada);
            if (!profesion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La profesión no existe',
                    errors: { message: 'La profesión no existe' }
                });
            }
            const especialidad = profesion.especialidadesAsignadas.id(idEspecialidadAsignada);
            especialidad.imgs.push(nombreArchivo);
            clinica.save((err, clinicaActualizada) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de especialidad agregada a clínica',
                    img: nombreArchivo
                });
            });

        });
    }
}

app.delete('/:tipo/:id/:nombreArchivo', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;
    var nombreArchivo = req.params.nombreArchivo;

    // Validar tipos de colecciones en las que se puede subir fotos
    var tiposValidos = ['profesionales', 'clinicas', 'usuarios', 'obras-sociales', 'pacientes', 'especialidades'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: { message: 'Tipo de colección no válida' }
        });
    }

    if (!id) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó imagen para eliminar. Id no válido',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }


    let path;
    if (tipo === 'especialidades') {
        const idClinica = id.split('|')[0];
        let carpeta = `./uploads/${ tipo }/${ idClinica }`;
        path = `${ carpeta }/${ nombreArchivo }`;
    } else {
        nombreArchivo = `${ id.replace(/\|/g,'') }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;
        path = `./uploads/${ tipo }/${ nombreArchivo }`;
    }

    // Elimina archivo
    if (fs.existsSync(path)) {
        fs.unlink(path, err => {});
    }



    eliminarPorTipo(tipo, nombreArchivo, id, res);


});

function eliminarPorTipo(tipo, nombreArchivo, id, res) {
    if (tipo === 'especialidades') {
        const idClinica = id.split('|')[0];
        const idProfesionAsignada = id.split('|')[1];
        const idEspecialidadAsignada = id.split('|')[2];

        Clinica.findById(idClinica, (err, clinica) => {
            if (!clinica) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La clínica no existe',
                    errors: { message: 'La clínica no existe' }
                });
            }
            const profesion = clinica.profesiones.id(idProfesionAsignada);
            if (!profesion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La profesión no existe',
                    errors: { message: 'La profesión no existe' }
                });
            }
            const especialidad = profesion.especialidadesAsignadas.id(idEspecialidadAsignada);

            especialidad.imgs.splice(especialidad.imgs.indexOf(nombreArchivo), 1);
            clinica.save((err, clinicaActualizada) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de especialidad eliminada de clínica',
                    img: nombreArchivo
                });
            });

        });

    }
}

module.exports = app;