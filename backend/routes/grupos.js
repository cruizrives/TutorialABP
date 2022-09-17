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
router.get('/', [
    validarJWT,
    check('id', 'El id del grupo debe ser válido').optional().isMongoId(),
    check('desde', 'El argumento desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerGrupos);

// Crear grupo
router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('curso', 'El argumento curso no es válido').isMongoId(),
    check('alumnos.*.usuario', 'El identificador de alumno no es válido').optional().isMongoId(),
    check('proyecto').optional().trim(),
    check('proyectodes').optional().trim(),
    validarCampos,
], crearGrupo);

// Actualizar grupo
router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('curso', 'El argumento curso no es válido').isMongoId(),
    check('id', 'El identificador no es válido').isMongoId(),
    check('alumnos.*.alumno', 'El identificador de alumno no es válido').optional().isMongoId(),
    check('proyecto').optional().trim(),
    check('proyectodes').optional().trim(),
    validarCampos,
], actualizarGrupo);

// Borrar grupo
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], borrarGrupo);

module.exports = router;