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
