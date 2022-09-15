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
- git clone -> Clonar el repositorio remoto en entorno local
- git branch -d -> Eliminar rama del repositorio local
- git merge -> Une la rama especificada con la rama en la que se encuentre actualmente
- q -> Salir de la terminal de git
- git fetch -p -> Actualizar la información de ramas que hayan sido borradas en remoto
- git push origin nombre de la rama a borrar en local:nombre de la rama a borrar en remoto -> Eliminar rama en remoto con un nombre distinto en local y remoto
- git push origin :nombre de la rama a borrar en remoto -> Eliminar rama en remoto con el mismo nombre en local y remoto

## Flujo de git

- Rama master -> Rama principal en la que se sucederán las diferentes versiones del proyecto
- Rama develop -> Surge de la master y de ella saldrán ramas individuales para implementar distintas características
- Rama feature -> Surge de la develop y sirve para implementar una tarea


