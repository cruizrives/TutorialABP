// Importación de módulos
const { Router } = require('express');
const { obtenerItems, crearItem, actualizarItem, borrarItem } = require('../controllers/items');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarTipoItem } = require('../middleware/validar-tipo-item');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

// Ruta base /api/items
router.get('/', [
    validarJWT,
    check('id', 'El id del item debe ser válido').optional().isMongoId(),
    check('desde', 'El argumento desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerItems);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('asignatura', 'El argumento asignatura no es válido').isMongoId(),
    check('tipo', 'El argumento tipo es obligatorio: MIN/OBL/OPT').not().isEmpty().trim(),
    validarTipoItem,
    check('descripcion').optional().trim(),
    check('horasEstimadas', 'El argumento horasEstimadas debe ser un número').optional().isNumeric(),
    check('horasAbsolutas', 'El argumento horasAbsolutas debe ser un true/false').optional().isBoolean(),
    validarCampos,
], crearItem);

router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('asignatura', 'El argumento asignatura no es válido').isMongoId(),
    check('tipo', 'El argumento tipo es obligatorio: MIN/OBL/OPT').not().isEmpty().trim(),
    validarTipoItem,
    check('descripcion').optional().trim(),
    check('horasEstimadas', 'El argumento horasEstimadas debe ser un número').optional().isNumeric(),
    check('horasAbsolutas', 'El argumento horasAbsolutas debe ser un true/false').optional().isBoolean(),
    validarCampos,
], actualizarItem);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], borrarItem);

module.exports = router;