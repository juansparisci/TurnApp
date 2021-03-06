// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

/**
 * CORS (Restringir antes de pasar a producción)
 */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

//Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var clinicaRoutes = require('./routes/clinica');
var profesionalRoutes = require('./routes/profesional');
var obraSocialRoutes = require('./routes/obra-social');
var profesionRoutes = require('./routes/profesion');
var pacienteRoutes = require('./routes/paciente');
var ocupacionRoutes = require('./routes/ocupacion');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

// Conexión a bdd
mongoose.connection.openUri('mongodb://localhost:27017/TurnApp', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});

// Rutas

app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/clinica', clinicaRoutes);
app.use('/profesional', profesionalRoutes);
app.use('/obra-social', obraSocialRoutes);
app.use('/profesion', profesionRoutes);
app.use('/paciente', pacienteRoutes);
app.use('/ocupacion', ocupacionRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});