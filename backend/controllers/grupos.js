// Importación de módulos
const { response } = require('express');
const Grupo = require('../models/grupos');
const Curso = require('../models/cursos');
const Usuario = require('../models/usuarios');

// Rutas CRUD
// Función para obtener los grupos con paginación
// A partir de un id devolver un resultado o todos si este no se envía
// Devolver la información con populate de cursos y alumnos
const obtenerGrupos = async(req, res = repsonse) => {
    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;

    try {

        let grupos, total;

        if (id){

            // Buscamos si encuentra a un curso con la id
            const existeGrupo = await Grupo.findById(id);
            // Comprobamos si existe dicho curso con esa id
            if (!existeGrupo) {
                return res.status(400).json({
                ok: false,
                msg: 'La id no existe'
                });
            }

            // Devolvemos la información
            [grupos, total] = await Promise.all([
                // Devolvemos la información populada de curso menos el campo __v y de alumnos los usuarios menos el password, alta y __v
                Grupo.findById(id).populate('curso', '-__v').populate('alumnos.usuario', '-password -alta -__v'),
                Grupo.countDocuments()
            ]);
        }
        else {
            [grupos, total] = await Promise.all([
                Grupo.find({}).skip(desde).limit(registropp).populate('curso', '-__v').populate('alumnos.usuario', '-password -alta -__v'),
                Grupo.countDocuments()
            ]);
        }
        
        res.status(400).json({
            ok: true,
            msg: 'obtenerGrupos',
            grupos,
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
            msg: 'Error al obtener grupos'
        });
    }
}

// Comprobar que el curso de la asignatura exista, que no haya un grupo con el mismo nombre y que la lista de alumnos sea correcta
const crearGrupo = async(req, res = response) => {

    const { nombre, alumnos, curso } = req.body;

    try {
        // Comprobar que el curso que se va a asignar al grupo existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en el grupo no existe'
            });
        }

        // Comprobar que no existe un grupo con ese nombre en ese curso
        const existeGrupo = await Grupo.findOne({ nombre, curso});
        if (existeGrupo) {
            return res.status(400).json({
                ok: false,
                msg: 'El grupo ya existe en el mismo curso'
            });
        }

        // Comprobar la lista de alumnos
        let listaAlumnosInsertar = [];
        
        if (alumnos){
            let listaAlumnosBusqueda = [];

            const listaAlu = alumnos.map(alumn => {
                // Si hay id
                if (alumn.usuario){
                    listaAlumnosBusqueda.push(alumn.usuario);
                    listaAlumnosInsertar.push(alumn);
                }
            });

            console.log(listaAlumnosBusqueda);
            // Comprobar que no haya duplicados ni alumnos que no existan
            const existenAlumnos = await Usuario.find().where('_id').in(listaAlumnosBusqueda);

            if (existenAlumnos.length != listaAlumnosBusqueda.length){
                return res.status(400).json({
                    ok:false,
                    msg:'Alguno de los alumnos indicados en el grupo no existe o están repetidos'
                });
            }
        }

        const grupo = new Grupo(req.body);
        grupo.alumnos = listaAlumnosInsertar;
        // Almacenar en BD
        await grupo.save();
        res.json({
            ok: true,
            msg: 'Grupo creado',
            grupo,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando grupo'
        });
    }
}

// Comprobar que el curso de la asignatura exista, que el grupo exista, que no haya un grupo con el mismo nombre y que la lista de alumnos sea correcta
const actualizarGrupo = async(req, res) => {

    const { nombre, alumnos, curso } = req.body;
    const uid = req.params.id;
    try {

        // Comprobar que el curso que se va a asignar al grupo existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en la asignatura no existe'
            });
        }

        // Comprobar que la id del grupo existe
        const existeGrupo = await Grupo.findById(uid);
        if (!existeGrupo) {
            return res.status(400).json({
                ok: false,
                msg: 'El grupo no existe'
            });
        }

        // Comprobar que no existe un grupo con ese nombre en ese curso
        const existeNombre = await Grupo.findOne({ nombre, curso});
        if (existeNombre && existeNombre._id != uid) {
            return res.status(400).json({
                ok: false,
                msg: 'El grupo ya existe en el mismo curso'
            });
        }

        // Comprobamos la lista de alumnos que nos envían que existan
        let listaalumnosinsertar = [];
        // Si nos ha llegado lista de alumnos comprobar que existen y hay limpiar campos raros
        if (alumnos) {
            let listaalumnosbusqueda = [];
            // Convertimos el array de objetos en un array con los strings de id de usuario
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaalu = alumnos.map(registro => {
                if (registro.usuario) {
                    listaalumnosbusqueda.push(registro.usuario);
                    listaalumnosinsertar.push(registro);
                }
            });
            // Comprobamos que los alumnos que nos pasan existen, buscamos todos los alumnos de la lista
            const existenAlumnos = await Usuario.find().where('_id').in(listaalumnosbusqueda);
            if (existenAlumnos.length != listaalumnosbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los alumnos indicados en el grupo no existe o están repetidos'
                });
            }
        }

        let object = req.body;
        object.alumnos = listaalumnosinsertar;

        const grupo = await Grupo.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Grupo actualizado',
            grupo
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando grupo'
        });
    }
}

// Que el grupo exista y eliminarlo
const borrarGrupo = async(req, res = response) => {
    const uid = req.params.id;
    try {
        // Comprobamos si existe el usuario que queremos borrar
        const existeGrupo = await Grupo.findById(uid);
        if (!existeGrupo) {
            return res.status(400).json({
                ok: true,
                msg: 'El grupo no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Grupo.findByIdAndRemove(uid);
        res.json({
            ok: true,
            msg: 'Grupo eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando grupo'
        });
    }
}

module.exports = { obtenerGrupos, crearGrupo, actualizarGrupo, borrarGrupo }