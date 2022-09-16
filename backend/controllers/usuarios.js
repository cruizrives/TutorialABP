// Importación de módulos
const Usuario = require('../models/usuarios');
const bcrypt = require('bcryptjs');

// Crea una función que recibe un request y envía un response, la marcamos como async porque después es muy probable que necesitemos que esta espere a resolverse
const obtenerUsuarios = async(req, res) => {

    // Recibe el parámetro desde y en caso de que no venga o no sea un número lo inicializa a 0
    const desde = Number(req.query.desde) || 0;
    // Número de registros por página
    const registropp = 5;

    try {

        // Comprobamos cuántos documentos tiene la colección
        // const total = await Usuario.countDocuments();
        // Buscamos en todos los registros de usuarios de la base de datos y devolvemos 10
        // const usuarios = await Usuario.find({}, "nombre apellidos email rol");
        // const usuarios = await Usuario.find({}, 'nombre apellidos email rol').skip(desde).limit(registropp);

        // Como estamos realizando dos llamadas await mejor las lanzamos a la vez con un Promise.all
        const [usuarios, total] = await Promise.all([
            // Obtenemos los usuarios desde el registro indicado hasta el límite de registros a partir del número desde
            // desde = 2 registropp = 5 -> enviaría desde el registro 2, 5 registros más, es decir 7
            Usuario.find({}, 'nombre apellidos email rol').skip(desde).limit(registropp),
            Usuario.countDocuments()
        ]);


        res.json({
            ok: true,
            msg: 'Obtener usuarios',
            // Podemos resumirlo en usuarios ya que creamos un campo con el mismo nombre que la variable que almacena los registros de usuarios
            usuarios: usuarios,
            page: {
                desde, registropp, total
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok:false,
            msg:'Error obteniendo usuarios'
        })
    }


}

// Función para crear usuario que envíe respuesta
// Comprobamos los errores de validación de forma genérica usando el middleware en el router para evitar tener que copiar el código por cada método de comprobación de errores
const crearUsuario = async (req, res) => {

// Comprobar si el email ya existe
// Obtenemos los valores necesarios del body mediante destructuración, esto sería lo mismo que const email = req.body.email
const { email, password, rol } = req.body;

try {

    // Buscamos si encuentra el email enviado en la base de datos 
    const existeEmail = await Usuario.findOne({ email: email });

    // Comprobamos si existe el usuario mediante el email (clave primaria)
    if (existeEmail) {
        return res.status(400).json({
        ok: false,
        msg: 'Email ya existe'
        });
    }

    // Ciframos la contraseña
    // Generamos un salt, una cadena aleatoria
    const salt = bcrypt.genSaltSync(); 
    // Ciframos la contraseña
    const cpassword = bcrypt.hashSync(password, salt); 

    // Guardamos el usuario en la bd, utilizando el modelo usuario de la base de datos y haciendo uso del body de la petición para llamar a su constructor
    const usuario = new Usuario(req.body);
    usuario.password = cpassword;
    await usuario.save();
        
    // Enviamos la respuesta en el caso de que todo haya sido válido
    res.json({
        ok: true,
        msg: 'Usuario creado',
        // Cuando se devuelve el usuario implícitamente se llama al método .toJSON
        usuario
    })
    
} catch (error) {
    console.log(error);
    return res.status(400).json({
        ok:false,
        msg:'Error creando usuario'
    })
}
}

// Función para actualizar el usuario
const actualizarUsuario = async(req, res = response) => {

    // Extraemos el password y nos aseguramos de que aunque venga el password no se va a actualizar, porque esto provocaría una brecha de seguridad
    // También extraemos el email para asegurarnos de que este no coincida con ninguno existente en la base de datos
    const { password, email, grupo, ...object } = req.body;
    const uid = req.params.id;

    // Usamos try catch cada vez que consultemos a la base de datos
    try {

    // Comprobar si está intentando cambiar el email, que no coincida con alguno que ya esté en BD
    // Obtenemos si hay un usuario en BD con el email que nos llega en post
    const existeEmail = await Usuario.findOne({ email: email });

    if (existeEmail) {
            // Si existe un usuario con ese email nos aseguramos de que sea el mismo usuario para no asignar a un usuario distinto el email
            if (existeEmail._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }
        // Asignamos al object el email validado
        object.email = email;
        // Actualizamos los datos del usuario, y con el new indicamos que el objeto usuario a devolver sea el modificado
        const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Usuario actualizado',
            usuario: usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }
}

// Función para borrar el usuario
const borrarUsuario = async(req, res) => {
    const uid = req.params.id;

    try {
        // Comprobamos si existe el usuario que queremos borrar
        const existeUsuario = await Usuario.findById(uid);
        if (!existeUsuario) {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no existe'
            });
        }

        // Lo eliminamos y devolvemos el usuaurio recién eliminado
        const resultado = await Usuario.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Usuario borrado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: true,
            msg: 'Error borrando usuario'
        });
    }
}

// Exportamos la función para usarla en routes
module.exports = { obtenerUsuarios, crearUsuario, actualizarUsuario, borrarUsuario  }