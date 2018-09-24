var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');

//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

var mdAutenticacion = require('../middlewares/autenticacion');

/**
 * Autenticación de google
 */
/* jshint ignore:start */

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}
/**
 * Renovar token
 */
app.get('/renuevatoken', mdAutenticacion.verificaToken, (req, res) => {
    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 }); // 4hs
    res.status(200).json({
        ok: true,
        token: token
    });
});

app.post('/google', async(req, res) => {
    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(e => {});

    if (!googleUser) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Token de google no válido.'
        });
    }

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Su mail ya se encuentra registrado sin su cuenta de google.'
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4hs

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB.id,
                    menu: obtenerMenu(usuarioDB.role)
                });
            }
        } else {
            // primer login de usuario
            usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar usuario',
                        errors: err
                    });
                }
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4hs

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB.id,
                    menu: obtenerMenu(usuarioDB.role)
                });
            })
        }
    });


    // if (googleUser == undefined) {

    //     return res.status(403).json({
    //         ok: false,
    //         mensaje: 'Token no valido'
    //     });
    // } else {
    //     return res.status(200).json({
    //         ok: true,
    //         mensaje: 'ok google',
    //         googleUser: googleUser
    //     });
    // }
});
/* jshint ignore:end */


/**
 * Autenticación propia
 */
app.post('/', (req, res) => {
    var body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - e',
                errors: err
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - p',
                errors: err
            });
        }
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4hs

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id,
            menu: obtenerMenu(usuarioDB.role)
        });
    });

});

function obtenerMenu(ROLE) {
    var menu = [
        /*{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'Progressbar', url: '/progress' },
                { titulo: 'Graficas', url: '/graficas1' },
                { titulo: 'Promesas', url: '/promesas' },
                { titulo: 'RxJs', url: '/rxjs' }
            ]
        },*/
        {
            titulo: 'Turnos',
            icono: 'fa fa-calendar',
            submenu: [
                { titulo: 'Hoy', url: '/turnos-hoy' },
                { titulo: 'Calendario', url: '/mis-turnos' },
                { titulo: 'Cancelar Turno', url: '/cancelar-turno' },
                { titulo: 'Agendar Turno', url: '/agendar-turno' }
            ]
        },
        {
            titulo: 'Mantenimiento',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                // {  titulo: 'Usuarios', url: '/usuarios'      },
                { titulo: 'Clinicas', url: '/clinicas' },
                { titulo: 'Profesionales', url: '/profesionales' }
            ]
        }
    ];
    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
        menu[1].submenu.unshift({ titulo: 'Obras Sociales', url: '/obras-sociales' });
        menu[1].submenu.unshift({ titulo: 'Pacientes', url: '/pacientes' });
    }
    return menu;
}
module.exports = app;