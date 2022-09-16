// Importación de módulos

// Cargando la clase Router otorgada por express
const { Router } = require('express');
const { obtenerUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { check } = require('express-validator'); 
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

// Ruta base /api/usuarios

// La ruta '/' a partir de la ruta base, '/api/usuarios', se atiende mediante la función getUsuarios del controlador
router.get('/', obtenerUsuarios);

// La ruta post a partir de la ruta base, '/api/usuarios'
// Realizamos las validaciones, el método crea en la petición, en el caso de que los parámetros de entrada no la pasen, un campo de errores
router.post('/', [
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    validarCampos
], crearUsuario);

router.put('/:id', [
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], actualizarUsuario);

router.delete('/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarUsuario);

// Exportamos el objeto router para poder usarlo fuera
module.exports = router;