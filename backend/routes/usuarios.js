// Importación de módulos, cargando la clase Router otorgada por express
const { Router } = require('express');

// Importación del método getUsuarios
const { getUsuarios } = require('../controllers/usuarios');

// Por último se exporta el objeto 'router' para que pueda ser utilizado desde fuera del módulo (en este caso desde index.js)
const router = Router();

// La ruta '/' a partir de la ruta base, '/api/usuarios', se atiende mediante la función getUsuarios del controlador
router.get('/', getUsuarios);

// Exportamos el objeto router para poder usarlo fuera
module.exports = router;