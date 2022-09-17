// Importación de módulos
const { Router } = require('express');
const { login } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const router = Router();

// Ruta base api/login
// Recibimos un password y un email, validamos los campos y llamar al controlador
router.post('/', [
    check('password', 'El argumento pasword es obligatorio').not().isEmpty(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    validarCampos,
], login);

module.exports = router;