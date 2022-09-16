// Importación de módulos
const { Router } = require('express');
const { obtenerGrupos, crearGrupo, actualizarGrupo, borrarGrupo } = require('../controllers/grupos');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const router = Router();

// Rutas CRUD
// Ruta base /api/grupos
// Obtener grupos
router.get('/', validarJWT, obtenerGrupos);

// Crear grupo
router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearGrupo);

// Actualizar grupo
router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], actualizarGrupo);

// Borrar grupo
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], borrarGrupo);

module.exports = router;