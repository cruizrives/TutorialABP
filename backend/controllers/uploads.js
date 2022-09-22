// Importación de módulos
const { response } = require('express');
const {v4: uuidv4} = require ('uuid');
const { actualizarBd } = require ('../helpers/actualizarBd');
const fs = require('fs');


// Subir los archivos
const subirArchivo = async(req, res = response) => {

    // Comprobar si se ha enviado un archivo
    if (!req.files || Object.keys(req.files).length === 0){
        return res.status(400).json({
            ok: false,
            msg: 'No se ha enviado el archivo'
        })
    }

    // Comprobar si el archivo ha superado el tamaño permitido
    // Comprobamos las características del objeto recibido en la petición
    // console.log(req.files); 

    if (req.files.archivo.truncated){
        return res.status(400).json({
            ok: false,
            msg: `El archivo es demasiado grande, el tamaño permitido es hasta ${process.env.MAXSIZEUPLOAD} mb`
        })
    }

    // Comprobar si estamos recibiendo el tipo correcto de archivo, los tipos pueden ser fotos de perfil o evidencias
    const tipo = req.params.tipo;

    // El id debería ser el identificador de mongo de la colección usuarios lo cual hemos comprobado en el routes
    const id = req.params.id;

    // Establecemos los tipos que se pueden usar
    const archivosValidos = {
        fotoperfil :['jpg', 'jpeg', 'png'],
        evidencia:['doc', 'docx', 'xls', 'pdf', 'zip']
    }

    // Extraemos la extensión del nombre
    const archivo = req.files.archivo;
    const nombrePartido = archivo.name.split('.');
    // Del array con las partes del nombre separadas por puntos queremos solo la extensión, es decir la última
    const extension = nombrePartido[nombrePartido.length -1];


    switch (tipo) {
        case 'fotoperfil':
            // Comprobamos si la extensión extraída no está dentro del array de archivos válidos
            if (!archivosValidos.fotoperfil.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo ${extension} no está permitido (${archivosValidos.fotoperfil})`
                })  
            }
            break;

        case 'evidencia':
            if (!archivosValidos.evidencia.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo ${extension} no está permitido (${archivosValidos.evidencia})`
                })  
            }
            break;
        
        default:
            return res.status(400).json({
                ok: false,
                msg: 'El tipo de operación no está permitida',
                tipoOperacion:tipo
            })
            break;
    }

    // Para guardar el archivo en el disco duro usamos la función nv
    // Para dar nombres únicos a los archivos usamos la función uuidv4
    const path = `${process.env.PATHUPLOAD}/${tipo}`;
    const nombreArchivo = `${uuidv4()}.${extension}`;
    const patharchivo = `${process.env.PATHUPLOAD}/${tipo}/${nombreArchivo}`
    archivo.mv(patharchivo, (err)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: `No se pudo cargar el archivo`,
            });
        }

        // Actualizamos la base de datos
        // Controlamos la promesa
        actualizarBd(tipo, path, nombreArchivo, id)
        .then(valor =>{
            if (valor){
                res.json({
                    ok: true,
                    msg: 'Archivo subido',
                    nombreArchivo
                });
            }
            else {
                fs.unlinkSync(patharchivo);
                res.status(400).json({
                    ok: false,
                    msg: 'No se pudo actualizar la base de datos'});
            }
        }).catch(err =>{
            fs.unlinkSync(patharchivo);
            res.status(400).json({
                ok: false,
                msg: 'Error al cargar archivos'});
        })



    })


}

// Enviar los archivos
const enviarArchivo = async(req, res = response) => {


    // Comprobar si estamos recibiendo el tipo correcto de archivo, los tipos pueden ser fotos de perfil o evidencias
    const tipo = req.params.tipo;
    const nombrearchivo = req.params.nombrearchivo;

    // Por defecto el path está protegido por un token de manera que cuando se tratan de cargar imágenes desde un lugar externo si no se cuenta con autorización, no se podrán visualizar
    const path = `${process.env.PATHUPLOAD}/${tipo}`;
    // Establecemos que patharchivo va a guardar la ruta tanto si hay foto como si no la hay
    patharchivo = `${path}/${nombrearchivo}`;

    // Si no existe foto
    if (!fs.existsSync(patharchivo)) {
        // Si el tipo no es fotoperfil
        if (tipo !== 'fotoperfil') {
            return res.status(400).json({
                ok: false,
                msg: 'Archivo no existe'
            });
        }
        // Enviamos una foto de no imagen
        patharchivo = `${process.env.PATHUPLOAD}/noimagen.png`;
    }
    // Enviamos la foto existente
    res.sendFile(patharchivo);

    // res.json({
    //     ok: true,
    //     msg: 'Archivos enviados',
    //     })
}



module.exports = { subirArchivo, enviarArchivo }