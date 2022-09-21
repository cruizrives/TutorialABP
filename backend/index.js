// Importación de módulos
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
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

// Para configurar el middleware para modificar las rutas a nivel global
app.use(fileUpload({
    // Limitar el tamaño de la subida a mb ya que el valor de la variable de entorno es 5 bytes por 1025 -> 50 kb por 1024 -> 5 mb
    limits: {fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024},
    // En el momento en el que el archivo que se está subiendo alcanza el límite, se trunca la subida y se corta, pero como lo hemos puesto a false, se subirán los 5 mb aunque podremos controlar el error
    abortOnLimit: false,
    // Al subir un archivo y almacenarlo si ésta carpeta no existe, se crea
    createParentPath: true,

}));

// Redirigir rutas
// Para hacer que cualquier cosa que venga con la ruta /api/usuarios sea atendido en la ruta de usuarios
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/grupos', require('./routes/grupos'));
app.use('/api/cursos', require('./routes/cursos'));
app.use('/api/asignaturas', require('./routes/asignaturas'));
app.use('/api/items', require('./routes/items'));
app.use('/api/uploads', require('./routes/uploads'));


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