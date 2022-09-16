// Importación de módulos
const express = require('express');
const cors = require('cors');
// Busca el archivo env en nuestro proyecto y de ahí carga las variables
require('dotenv').config();
// Para conectar la base de datos, importamos el método dbConnection
const { dbConnection } = require('./database/configdb');

// Crear una aplicación de express
const app = express();

// Para usar la base de datos
dbConnection();

// La función app.use actúa como middleware

// Indicamos el uso del middleware cors en las rutas
app.use(cors());

// Middleware para manejar el JSON que llega con las peticiones
app.use(express.json());

// Redirigir rutas
// Para hacer que cualquier cosa que venga con la ruta /api/usuarios sea atendido en la ruta de usuarios
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

// Abrir la aplicación en el puerto 3000
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});

// A partir de aquí lo comentamos ya que vamos a usar los controladores y rutas

// Enviar peticiones get al recurso / la cual se responde con el mensaje montado como json
// app.get('/', (req, res) => {
//     res.json({
//         ok: true,
//         msg: 'Servidor activo'
//     });
// });

// app.get('/', (req, res) => {
//     res.status(404).json({
//         ok: false,
//         msg: 'Recurso inalcanzable'
//     });
// });