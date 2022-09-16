// Importación de módulos
const { response } = require('express');
const Grupo = require('../models/grupos');

// Rutas CRUD
// Función para obtener los grupos con paginación
const obtenerGrupos = async(req, res = repsonse) => {
    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    try {
        const [grupos, total] = await Promise.all([
            Grupo.find({}).skip(desde).limit(registropp),
            Grupo.countDocuments()
        ]);
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

const crearGrupo = async(req, res = response) => {
    // Eliminamos los espacios de forma que no molesten posteriormente en la bd
    const nombre = String(req.body.nombre).trim();
    try {
        // Comrprobar que no existe un usuario con ese nombre 
        const existeGrupo = await Grupo.findOne({ nombre: nombre });
        if (existeGrupo) {
            return res.status(400).json({
                ok: false,
                msg: 'El grupo ya existe'
            });
        }
        const grupo = new Grupo(req.body);
        grupo.nombre = nombre;
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

const actualizarGrupo = async(req, res) => {
    const nombre = String(req.body.nombre).trim();
    const object = req.body;
    const uid = req.params.id;
    try {
        // Si han enviado el nombre, comprobar que no exista otro en BD con el mismo nombre
        if (nombre) {
            const existeGrupo = await Grupo.findOne({ nombre });
            if (existeGrupo) {
                if (existeGrupo._id != uid) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El grupo ya existe'
                    });
                }
            }
            object.nombre = nombre;
        }
        const grupo = await Grupo.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Usuario actualizado',
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