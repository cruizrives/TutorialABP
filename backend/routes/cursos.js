// Importación de módulos
// Cargando la clase Router otorgada por express
const { Router } = require('express');
const { obtenerCursos, crearCurso, actualizarCurso, borrarCurso } = require('../controllers/cursos');
const { check } = require('express-validator'); 
const { validarJWT } = require('../middleware/validar-jwt');
const { validarCampos } = require('../middleware/validar-campos');
const router = Router();

// Ruta base /api/cursos
// La ruta '/' a partir de la ruta base, '/api/cursos'
router.get('/', [
    validarJWT,
    check('id', 'El id del curso debe ser válido').optional().isMongoId(),
    check('desde', 'El argumento desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerCursos);

// La ruta post a partir de la ruta base, '/api/cursos'
// Realizamos las validaciones, el método crea en la petición, en el caso de que los parámetros de entrada no la pasen, un campo de errores
router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombreCorto', 'El argumento nombre corto es obligatorio').not().isEmpty().trim(),
    check('activo', 'El argumento activo es obligatorio y debe ser true/false').isBoolean(),
    validarCampos,
], crearCurso);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombreCorto', 'El argumento nombre corto es obligatorio').not().isEmpty().trim(),
    check('activo', 'El argumento activo es obligatorio y debe ser true/false').isBoolean(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], actualizarCurso);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarCurso);

// Exportamos el objeto router para poder usarlo fuera
module.exports = router;