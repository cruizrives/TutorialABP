// Importación de módulos
const { Router } = require('express');
const { enviarArchivo, subirArchivo } = require('../controllers/uploads');
const { validarJWT } = require('../middleware/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

// Ruta base /api/uploads/tipo
router.get('/:tipo/:nombrearchivo', [
    validarJWT,
    // Limpiamos el id en caso de que nos lo pasen con espacios, ya que el id representa el nombre del archivo
    check('nombrearchivo', 'El nombre del archivo debe ser válido').trim(),
    validarCampos,
], enviarArchivo);

router.post('/:tipo/:id', [
    validarJWT,
    check('id', 'El id debe ser válido').isMongoId(),
    validarCampos,
], subirArchivo);


module.exports = router;