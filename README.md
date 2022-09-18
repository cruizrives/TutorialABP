# Tutorial ABP
Curso del tutorial para el ABP

## Comandos de git

- git branch -> Visualizar las ramas locales
- git branch -a -> Visualizar las ramas locales y remotas pero con la información del último pull
- git checkout -b x -> Crear rama y desplazarse a ella
- git config --list -> Mostrar las variables de git
- git config --global user.x -> Cambiar a nivel global todas las variables de git
- git checkout -> Desplazarse entre commits y ramas
- git fetch -> Visualizar las ramas remotas sin tener que descargarlas
- git add . -> Añadir todos los cambios al control de versiones
- git commit -m "x" -> Captura una instantánea de los cambios que hay en el repositorio local y los almacena
- git push -> Subir los cambios al repositorio remoto
- git push -u origin nombre-rama -> Subir la nueva rama al repositorio remoto
- git clone -> Clonar el repositorio remoto en entorno local
- git branch -d -> Eliminar rama del repositorio local
- git merge -> Une la rama especificada con la rama en la que se encuentre actualmente
- q -> Salir de la terminal de git
- git fetch -p -> Actualizar la información de ramas que hayan sido borradas en remoto
- git push origin nombre-rama-local:nombre-rama-remoto -> Eliminar rama en remoto con un nombre distinto en local y remoto
- git push origin :nombre-rama-remoto -> Eliminar rama en remoto con el mismo nombre en local y remoto

## Flujo de git

- Rama master -> Rama principal en la que se sucederán las diferentes versiones del proyecto
- Rama develop -> Surge de la master y de ella saldrán ramas individuales para implementar distintas características
- Rama feature -> Surge de la develop y sirve para implementar una tarea

## Problema con git branch

Para que funcione tuve que:
Cerrar Vscode
Introducir rm -rf ~/.config/Code/*Cache*
Volver a iniciar Vscode en la carpeta del proyecto git

## Network graph

Muestra las ramas y sus estados como nodos, de forma que cuando dos ramas tienen la misma información aparecerán una sobre la otra en el mismo nodo indicando que contienen la misma información, mientras que si tienen distinta información aparecerán en distintos nodos.

## Instalación de node y paquetes

- npm install -g x
- El paquete npm es un instalador que nos permite añadir diferentes extensiones y paquetes. Con -g indicamos que lo hacemos a nivel global
- Typescript -> tsc -v
- Angular cli -> ng version
- Angular cli permite generar aplicaciones de manera muy simple para angular

## Inicio del proyecto

### Comandos importantes

- npm init -y -> Crea el archivo package.json, estableciendo que se introduzcan las opciones por defecto
- npm install express --save -> Paquete de ExpressJS que nos evita programar desde cero todo el código
- node index.js -> Para ejecutar el programa js utilizando node
- npm install 'modulo' -> Para instalar módulos
- npm uninstall 'modulo' -> Para desinstalar módulos
- node 'x.js' -> Para comenzar el servidor con node
- nodemon 'x.js' -> Para comenzar el servidor con nodemon
- http://localhost:3000/


### Información

- El archivo package-lock.json hace un seguimiento de la versión exacta de cada paquete
- El archivo package.json almacena la información clave de la aplicación
- Paquete nodemon para automatizar el proceso de actualizar la ejecución al realizar cambios
- Para agilizar el proceso de iniciar el servidor podemos usar scripts de inicio y para poder mostrarlos en la barra lateral hay que ir a los tres puntos al lado de Explorer > NPM Scripts

## Postman 

- Se utiliza para almacenar peticiones http en colecciones y poder reenviarlas después más fácilmente así como para poder acceder a más información sobre cada una de ellas
- Para incluir datos al hacer la petición, rellenamos el campo body, indicando que es de tipo Raw y configurándolo como JSON
- Para incluir una cabecera se introduce el nombre, x significa que es personalizada y el token

## Cors

- Sirve para poder solicitar recursos restringidos desde un dominio diferente al dominio de origen
- Cuando se obtiene un error de Cors, esto indica que la web obliga a que el api y la página tengan que estar en el mismo servidor

## Env 

- Permite crear un archivo que contendrá variables de entorno las cuales se llamarán con process.env para agilizar la escritura de código
- He tenido que quitar del .gitignore el archivo .env

## Conexión a MongoDB

- Para comprobar el puerto, revisar el archivo mongodb.cfg
- MongoDB es una aplicación como servicio que se inicia con el Sistema operativo
- useCreateIndex: true y useFindAndModify: false están deprecadas por lo que ya no hace falta ponerlas
- Al conectar la base de datos con el localhost me saltaba el error connect-econnrefused, el cual he solucionado cambiando el host a 127.0.0.1:27017, tanto en Compass como las variables de entorno
- CompassMongoDB puede creas la base de datos y las colecciones en el caso de que no las tengamos hechas cuando las utilicemos en el código

## MongoDB

- En el caso de que importe un modelo en la base de datos, y luego modifique algunas propiedades como unique del mismo modelo, tendré que dropear la base de datos para que los cambios se actualicen

## Controladores, routers y models

- Controllers: se almacenan los controladores
- Routers: se almacenan las rutas
- Models: se almacenan las representaciones de los objetos almacenados en la base de datos, contamos con los esquemas que define la estructura de los registros de la bd y los modelos que son la conexión entre los esquemas y la bd
- Flujo de trabajo: llega una petición a index.js que es atendida por el fichero correspondiente en las rutas, y que ejecuta el método dispuesto para ello gracias al controlador, que atiende la petición y envía la respuesta.

## Express validator

- Es útil para validar los campos de forma rápida
- Usamos el método check que por defecto realizará validaciones sobre todos las partes de la request

## Bcryptjs

- Librería para cifrar contraseñas en la base de datos

## Jsonwebtoken

- Devuelven un web token
- Los web tokens son cadenas que contienen información como la id en el campo payload, pero que se encuentran firmadas de modo que nadie va a poder cambiarlas
- Los token solo se pueden generar por el backend
- iat es la fecha de generación del token
- Para comprobar si el token tiene la información correcta y está firmado vamos a https://jwt.io/
- Para cada llamada a la API se debe enviar el JWT para poder comprobarlo en el backend
- El frontend enviará esto en cada llamada que necesite seguridad mediante un header y este deberá ser validado en el backend
- Las rutas de login generan el token y las rutas de usuarios permiten acceder a ellas solo si se encuentra este token en la cabecera
- Las peticiones de login deben incorporar la cabecera
- Solo un token generado por nuestro helper al hacer login será el que pase las validaciones
- Podemos generar un JWT con validez de 1 año 1y, o bien generar en la página oficial un JWT con los parámetros de rol, uid, iat y exp y como en el método validar-jwt no comprobamos la validez de los campos enviados, nos permitirá crear un JWT que será interpretado como válido sin  tener usuarios en la base de datos. También debemos recordar añadir la firma secreta en nuestro fichero .env.
- Parámetros: {"uid": "632593735e2b4ddca9269af2", "rol": "ADMIN","iat": 1516239022,"exp": 3416239022} 

## Referencias a la base de datos

- Para que funcione es necesario añadir en la petición el id del grupo a conectar con el usuario

## Validaciones

- La lógica de negocio debería ir en el controlador
- La lógica de validación debería ir en el router


## SPA

- En el navegador reside toda la aplicación web menos los datos que son obtenidos de la API

## Angular

### Comandos

- npm i -g @angular/cli -> Para instalar la última versión de Angular Cli
- ng version -> Para saber la versión de Angular Cli
- ng new frontend -> Para crear el frontend automáticamente, establecemos que use routing, es decir que tenga distintas rutas y CSS
- ng serve -o -> Lanzamos un servidor local que ejecuta la aplicación de Angular y el -o es para que lo haga automáticamente
- ng serve -o --port 3000 -> Establecemos el puerto
- ng generate component nombreCarpeta nombreComponente / ng g c / ng g c --skip-tests -> Crear un componente sin que te genere los spec
- ng g m / ng g m --flat nombreCarpeta nombreModulo -> Crear un module y ponemos el flat para que no cree una carpeta cuando tenga el mismo nombre que el módulo

### Explicación

- Angular trabaja con componentes que reciben o emiten datos a la API y representan cada uno de los elementos mostrados en el frontend
- Algunos de estos componentes serán servicios
- Básicamente los componentes son partes de HTML definidas en la carpeta app, (contiene el css, html, ts o typescript que implementa la lógica de dicho componente) y se incrustan en el index.html
- La configuración del componente se establece en el ts
- Cada vez que creamos un componente, este se importa en el archivo module.ts para permitir la incrustación de los nuevos componentes en el original creado por Angular

### Routing

- Se puede crear una ruta padre de la que salen hijas en app-routing.module.ts que se encuentra en el componente inicial creado por Angular
- Para sintetizar los componentes hijos, hay que especificar en el html del padre la etiqueta <router-outlet><router-outlet>

### Plantilla Matrix de Bootstrap

- Pegamos las carpetas de la plantilla en assets, en total son js, css, images, libs y extra-libs

### Rutas en angular

- Añadir a cualquier clase la directiva routerlink="/ruta"

### Formularios template vs reactivos

- Para validar formularios se aceptan los template que se realizan mediante algunas validaciones en el html o los reactivos que se hacen a base de código puro, es mejor usar estos últimos, ya que si no, se ensucia el HTML y es mejor dejar la lógica de negocio en el ts del componente a validar

### Truco opciones de desarrollador

- Pulsar en la rueda de configuración y elegir selected context only para ocultar mensajes de warning de includes de css

### CSS

- He añadido el sitio web http://localhost:4200 a la lista de sitios donde las cookies se borran al cerrar la pestaña, porque si no el navegador no actualizaba los cambios del css

### Servicios

- Sirven para comunicar el backend y el frontend y son fácilmente reutilizables

### LocalStore vs SesionStore

- Porción de la memoria que el navegador pone a disposición de las aplicaciones web para que éstas puedan almacenar ahí lo que quieran
- La información se guarda en forma de {clave:valor}
- Este pedazo de información es exclusivo para cada aplicación web
- Lo almacenado en estas zonas de memoria no es confiable ya que es completamente visible y propenso a borrados, modificaciones, copiados...
- Lo almacenado en LocalStore no se borra al cerrar el navegador mientras que lo del SesionStore sí lo hace
- Para acceder a las pestañas del navegador vamos a la sección Application

### Sweetalert2

- https://sweetalert2.github.io/
- Para importar es necesario usar import Swal from 'sweetalert2'
- Para bloquear el mensaje de alerta modificamos la propiedad de backdrop