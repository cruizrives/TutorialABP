// Importación de módulos
const { response } = require('express');
const Asignatura = require('../models/asignaturas');
const Curso = require('../models/cursos');
const Usuario = require('../models/usuarios');

// Sobrecarga para recibir un id y devolver datos de esa asignatura o si no, de todas, y crear paginación
// Devolver la información con populate curso y profesores
const obtenerAsignaturas = async(req, res = response) => {

    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;

    try {


        let asignaturas, total;
        if (id) {

            const existeAsignatura = await Asignatura.findById(id);
            if (!existeAsignatura) {
                return res.status(400).json({
                ok: false,
                msg: 'La id no existe'
                });
            }

            [asignaturas, total] = await Promise.all([
                // Populamos asignatura para que se pueda recibir información sobre cursos y profesores
                // El populate va a ir a la colección cursos, que tiene una referencia en asignaturas, y va a devolver toda la información que encuentre
                // El populate va a ir a la colección profesores y va a extraer los datos de dichos usuarios, además le añadimos un filtro para que no nos devuelva la fecha de alta del usuario, su contraseña ni el campo __v generado automáticamente por la base de datos
                Asignatura.findById(id).populate('curso').populate('profesores.usuario', '-password -alta -__v'),
                Asignatura.countDocuments()
            ]);
        } else {
            [asignaturas, total] = await Promise.all([
                Asignatura.find({}).skip(desde).limit(registropp).populate('curso').populate('profesores.usuario', '-password -alta -__v'),
                Asignatura.countDocuments()
            ]);
        }

        res.json({
            ok: true,
            msg: 'obtenerAsignaturas',
            asignaturas,
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener asignaturas'
        });
    }
}

// Comprobamos que el curso de la asignatura exista y que la lista de profesores que llega sea válida y almacenar solo los objetos donde haya una id
const crearAsignatura = async(req, res = response) => {

    const { curso, profesores, nombre, nombreCorto } = req.body;

    try {

        // Comprobar que el curso que se va a asignar a la asignatura existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en la asignatura no existe'
            });
        }

        // Array para insertar los objetos
        let listaprofesoresinsertar = [];

        // Si nos ha llegado lista de profesores comprobar que existen y que no hay limpiar campos raros
        if (profesores) {

            // Array para insertar los usuarios y comprobar que existan
            let listaprofesoresbusqueda = [];

            // Convertimos el array de objetos en un array con los strings de id de profesor
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaprof = profesores.map(prof => {
                if (prof.usuario) {
                    // Añadimos el usuario al array asegurándonos de que solo se incluyen ids
                    listaprofesoresbusqueda.push(prof.usuario);
                    // Añadimos el objeto para luego utilizarlo para la creación de la asignatura, pero solo usamos los profesores con campos limpios, ya que si no, estamos creando en la base de datos un hueco, ya que ésta no detectaría el campo con un nombre erróneo e insertaría la información en un campo vacío
                    listaprofesoresinsertar.push(prof);
                }
            });

            // Comprobamos que los id que nos pasan existen y los que lo hagan se introducen en el objeto existenProfesores una vez
            const existenProfesores = await Usuario.find().where('_id').in(listaprofesoresbusqueda);

            // Comprobar la longitud de ambas listas, si no coinciden es que hay profesores incorrectos, ya sea por duplicados o porque las id no existían en la colección de profesores
            if (existenProfesores.length != listaprofesoresbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los profesores indicados en la asignatura no existe o están repetidos'
                });
            }

        }

        // Comprobación de los campos nombre y nombre corto
        
        // Buscamos si encuentra el nombre o nombreCorto enviado en la base de datos 
        const existeNombre = await Asignatura.findOne({ nombre: nombre });
        const existeNombreCorto = await Asignatura.findOne({ nombreCorto: nombreCorto });

        // Comprobamos si existe el nombre o nombre corto
        if (existeNombre) {
            return res.status(400).json({
            ok: false,
            msg: 'Asignatura con ese nombre ya existente'
            });
        }

        if (existeNombreCorto) {
            return res.status(400).json({
            ok: false,
            msg: 'Asignatura con ese nombre corto ya existente'
            });
        }

        const asignatura = new Asignatura(req.body);
        // Sustituir el campo profesores por la lista de profesores preparada
        asignatura.profesores = listaprofesoresinsertar;
        // Almacenar en BD
        await asignatura.save();

        res.json({
            ok: true,
            msg: 'Asignatura creada',
            asignatura
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando asignatura'
        });
    }
}

// Comprobar que la asignatura, el curso, y la lista de profesores a actualizar existan
const actualizarAsignatura = async(req, res) => {

    const { profesores, curso, nombre, nombreCorto } = req.body;
    const uid = req.params.id;

    try {

        // Comprobar que la asignatura que se va a actualizar existe
        const existeAsignatura = await Asignatura.findById(uid);
        if (!existeAsignatura) {
            return res.status(400).json({
                ok: false,
                msg: 'La asignatura no existe'
            });
        }

        // Comprobar que el curso que se va a asignar a la asignatura existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en la asignatura no existe'
            });
        }

        let listaprofesoresinsertar = [];
        // Si nos ha llegado lista de profesores comprobar que existen y que no hay limpiar campos raros
        if (profesores) {
            let listaprofesoresbusqueda = [];
            // Convertimos el array de objetos en un array con los strings de id de usuario
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaprof = profesores.map(registro => {
                if (registro.usuario) {
                    listaprofesoresbusqueda.push(registro.usuario);
                    listaprofesoresinsertar.push(registro);
                }
            });
            // Comprobamos que los profesores que nos pasan existen, buscamos todos los profesores de la lista
            const existenProfesores = await Usuario.find().where('_id').in(listaprofesoresbusqueda);
            if (existenProfesores.length != listaprofesoresbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los profesores indicados en la asignatura no existe o están repetidos'
                });
            }
        }

        // Comprobación de los campos nombre y nombre corto
        // Buscamos si encuentra el nombre o nombreCorto enviado en la base de datos 
        const existeNombre = await Asignatura.findOne({ nombre: nombre });
        const existeNombreCorto = await Asignatura.findOne({ nombreCorto: nombreCorto });

        // Comprobamos si existe el nombre o nombre corto
        if (existeNombre && existeNombre._id != uid) {
            return res.status(400).json({
            ok: false,
            msg: 'Asignatura con ese nombre ya existente'
            });
        }

        if (existeNombreCorto && existeNombreCorto._id != uid) {
            return res.status(400).json({
            ok: false,
            msg: 'Asignatura con ese nombre corto ya existente'
            });
        }

        const object = req.body;
        object.profesores = listaprofesoresinsertar;
        const asignatura = await Asignatura.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Asignatura actualizada',
            asignatura
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando asignatura'
        });
    }
}

// Comprobar que la asignatura que llega exista
const borrarAsignatura = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // Comprobamos si existe la asignatura que queremos borrar
        const existeAsignatura = await Asignatura.findById(uid);
        if (!existeAsignatura) {
            return res.status(400).json({
                ok: true,
                msg: 'La asignatura no existe'
            });
        }
        // La eliminamos y la devolvemos
        const resultado = await Asignatura.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Asignatura eliminada',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando asignatura'
        });

    }
}

// Exportamos los métodos
module.exports = { obtenerAsignaturas, crearAsignatura, actualizarAsignatura, borrarAsignatura }