// Importación de módulos
const { response } = require('express');
const { validationResult } = require('express-validator');

// Con validationResult comprobamos si el método check ha generado errores y si es así, enviamos una respuesta de error, si no los hay llama a la función next
// Tipamos el método response para poder hacer uso de las recomendaciones de Vscode al usar el objeto res
const validarCampos = (req, res = response, next) => {
    const erroresVal = validationResult(req);
    if (!erroresVal.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errores: erroresVal.mapped()
        });
    }
    next();
}
module.exports = { validarCampos }