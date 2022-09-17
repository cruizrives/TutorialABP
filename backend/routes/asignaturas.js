// Importación de módulos
const { Router } = require('express');
const { obtenerAsignaturas, crearAsignatura, actualizarAsignatura, borrarAsignatura } = require('../controllers/asignaturas');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

// Ruta base /api/asignaturas
router.get('/', [
    validarJWT,
    // Campos opcionales que si vienen los validamos desde e id
    check('id', 'El id del asignatura debe ser válido').optional().isMongoId(),
    check('desde', 'El argumento desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerAsignaturas);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombreCorto', 'El argumento nombre corto es obligatorio').not().isEmpty().trim(),
    check('curso', 'El argumento curso no es válido').isMongoId(),
    // Como es un campo opcional, si llegan profesores , y siempre que éstos contengan usuarios, se comprueba la id
    check('profesores.*.usuario', 'El identificador de profesor no es válido').optional().isMongoId(),
    validarCampos,
], crearAsignatura);

router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('nombreCorto', 'El argumento nombrecorto es obligatorio').not().isEmpty(),
    check('curso', 'El argumento curso no es válido').isMongoId(),
    check('profesores.*.usuario', 'El identificador de profesor no es válido').optional().isMongoId(),
    validarCampos,
], actualizarAsignatura);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], borrarAsignatura);

module.exports = router;