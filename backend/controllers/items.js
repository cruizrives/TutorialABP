// Importación de módulos
const { response } = require('express');
const Item = require('../models/items');
const Asignatura = require('../models/asignaturas');
const Usuario = require('../models/usuarios');
const Curso = require('../models/cursos');

// Sobrecarga para devolver todos los ítems y si recibe un id devolver información sobre ese ítem en concreto, y devolver populate de asignatura
const obtenerItems = async(req, res = response) => {

    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    // Id item
    const id = req.query.id;

    try {
        let items, total;
        if (id) {

            const existeItem = await Item.findById(id);
            if (!existeItem) {
                return res.status(400).json({
                ok: false,
                msg: 'La id no existe'
                });
            }

            [items, total] = await Promise.all([
                // Populamos los resultados haciendo referencia a la asignatura y haciendo que además devuelva la información de los profesores y del curso
                // El populate va al modelo de ítems, encuentra la referencia a asignatura, pero para que muestre la información de cursos y usuarios, le indicamos que tiene que ir al path de profesores y con eso obtenemos los usuarios, y con el selec t
                Item.findById(id).populate({ path: 'asignatura', populate: { path: 'profesores.usuario', select: '-password' } }).populate({ path: 'asignatura', populate: { path: 'curso' } }),
                Item.countDocuments()
            ]);
        } else {
            [items, total] = await Promise.all([
                Item.find({}).skip(desde).limit(registropp).populate({ path: 'asignatura', populate: { path: 'profesores.usuario', select: '-password' } }).populate({ path: 'asignatura', populate: { path: 'curso' } }),
                Item.countDocuments()
            ]);
        }

        res.status(400).json({
            ok: true,
            msg: 'obtenerItems',
            items,
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
            msg: 'Error al obtener ítems'
        });
    }
}

// Comprobar que la asignatura existe
const crearItem = async(req, res = response) => {

    const { asignatura, ...object } = req.body;

    try {
        // Comprobar que el asignatura que se va a asignar al ítem existe
        const existeAsignatura = await Asignatura.findById(asignatura);
        if (!existeAsignatura) {
            return res.status(400).json({
                ok: false,
                msg: 'La asignatura asignada en el ítem no existe'
            });
        }

        object.asignatura = asignatura;
        const item = new Item(object);

        // Almacenar en BD
        await item.save();

        res.json({
            ok: true,
            msg: 'Item creado',
            item,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando ítem'
        });
    }
}

// Comprobar que la asignatura y el item a usar existen
const actualizarItem = async(req, res) => {

    const object = req.body;
    const uid = req.params.id;
    const asignatura = req.body.asignatura;


    try {
        // Comprobar que la asignatura que se va a asignar al item existe
        const existeAsignatura = await Asignatura.findById(asignatura);
        if (!existeAsignatura) {
            return res.status(400).json({
                ok: false,
                msg: 'La asignatura asignada al ítem no existe'
            });
        }

        const existeItem = await Item.findById(uid);
        if (!existeItem) {
            return res.status(400).json({
                ok: false,
                msg: 'El ítem no existe'
            });
        }

        const item = await Item.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Ítem actualizado',
            item
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando ítem'
        });
    }
}

// Comprobar que el ítem existe y eliminarlo
const borrarItem = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // Comprobamos si existe el ítem que queremos borrar
        const existeItem = await Item.findById(uid);
        if (!existeItem) {
            return res.status(400).json({
                ok: true,
                msg: 'El item no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Item.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Ítem eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando ítem'
        });

    }
}

module.exports = { obtenerItems, crearItem, actualizarItem, borrarItem }