// Importación de módulos
const Curso = require('../models/cursos');
const { response } = require('express');

// Crea una función que recibe un request y envía un response, la marcamos como async porque después es muy probable que necesitemos que esta espere a resolverse
// Si la función recibe un id devuelve información de ese curso en concreto
// Sobrecarga para recibir un id y devolver solo los datos necesarios o recibir registro desde y devolver lista paginada
const obtenerCursos = async(req, res) => {
    
    // Obtenemos el id del curso pasado por la request
    const id = req.query.id;
    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = process.env.DOCSPERPAGE;

    try {

        let cursos, total;

        // Si recibimos un id comprobamos si es válido
        if (id) {
  
            // Buscamos si encuentra a un curso con la id
            const existeCurso = await Curso.findById(id);

            // Comprobamos si existe dicho curso con esa id
            if (!existeCurso) {
                return res.status(400).json({
                ok: false,
                msg: 'La id no existe'
                });
            }
                
            // Devolvemos la información de ese curso
            [cursos, total] = await Promise.all([
                Curso.findById(id),
                Curso.countDocuments()
            ]);
            
        // Si no recibimos id devolvemos todos los resultados
        } else {

            [cursos, total] = await Promise.all([
                Curso.find({}).skip(desde).limit(registropp),
                Curso.countDocuments()
            ]);
        }
         
        res.json({
            ok: true,
            msg: 'Cursos obtenidos',
            cursos: cursos,
            page: {
                desde, registropp, total
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok:false,
            msg:'Error obteniendo cursos'
        })
    }
}

// Función para crear curso que envíe respuesta
// Comprobamos los errores de validación de forma genérica usando el middleware en el router para evitar tener que copiar el código por cada método de comprobación de errores
const crearCurso = async (req, res) => {

    // Comprobar si el nombre o nombre corto ya existen
    const { nombre, nombreCorto } = req.body;

    try {

        // Buscamos si encuentra el nombre o nombreCorto enviado en la base de datos 
        const existeNombre = await Curso.findOne({ nombre: nombre });
        const existeNombreCorto = await Curso.findOne({ nombreCorto: nombreCorto });

        // Comprobamos si existe el nombre o nombre corto
        if (existeNombre) {
            return res.status(400).json({
            ok: false,
            msg: 'Curso con ese nombre ya existente'
            });
        }

        if (existeNombreCorto) {
            return res.status(400).json({
            ok: false,
            msg: 'Curso con ese nombre corto ya existente'
            });
        }

        // Guardamos el curso
        const curso = new Curso(req.body);
        await curso.save();
        
        // Enviamos la respuesta en el caso de que todo haya sido válido
        res.json({
            ok: true,
            msg: 'Curso creado',
            curso
        })
    
} catch (error) {
    console.log(error);
    return res.status(400).json({
        ok:false,
        msg:'Error creando curso'
    })
}
}

// Función para actualizar el curso
// Comprobamos que el nombre o nombre corto a actualizar no exista en otro curso y que en este caso, sea el mismo que el nombre o nombre corto del curso que está intentando realizar la operación
const actualizarCurso = async(req, res = response) => {

    // Extraemos el nombre y nombre corto para asegurarnos de que este no coincida con ninguno existente en la base de datos
    const { nombreCorto, nombre } = req.body;
    const uid = req.params.id;

    // Usamos try catch cada vez que consultemos a la base de datos
    try {

        // Buscamos si encuentra a un curso con la id
        const existeCurso = await Curso.findById(uid);

        // Comprobamos si existe dicho curso con esa id
        if (!existeCurso) {
            return res.status(400).json({
            ok: false,
            msg: 'La id no existe'
            });
        }

        // Comprobar si está intentando cambiar el nombre o nombre corto, que no coincidan con alguno que ya esté en BD
        // Obtenemos si hay un curso en BD con el nombre o nombre corto que nos llega en post
        const existeNombre = await Curso.findOne({ nombre: nombre });
        const existeNombreCorto = await Curso.findOne({ nombreCorto: nombreCorto });

        // Me aseguro de que si ya existe ese nombre o nomnbre corto sean el del propio curso
        if (existeNombre && existeNombre._id != uid) {

            // Si no coinciden las id entonces lanzo un error
            return res.status(400).json({
                ok: false,
                msg: 'Curso con ese nombre ya existente'
            });
        }
         
        if (existeNombreCorto && existeNombreCorto._id != uid) {
            return res.status(400).json({
                ok: false,
                msg: 'Curso con ese nombre corto ya existente'
            });
        }

        // Actualizamos los datos del curso, y con el new indicamos que el objeto curso a devolver sea el modificado
        const curso = await Curso.findByIdAndUpdate(uid, req.body, { new: true });

        res.json({
            ok: true,
            msg: 'Curso actualizado',
            curso: curso
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando curso'
        });
    }
}

// Función para borrar el curso
// Recibimos un id de curso y lo eliminamos
const borrarCurso = async(req, res) => {
    const uid = req.params.id;

    try {
        // Comprobamos si existe el curso que queremos borrar
        const existeCurso = await Curso.findById(uid);
        if (!existeCurso) {
            return res.json({
                ok: true,
                msg: 'El curso no existe'
            });
        }

        // Lo eliminamos y devolvemos el curso recién eliminado
        const resultado = await Curso.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Curso borrado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: true,
            msg: 'Error borrando curso'
        });
    }
}

// Exportamos la función para usarla en routes
module.exports = { obtenerCursos, crearCurso, actualizarCurso, borrarCurso  }