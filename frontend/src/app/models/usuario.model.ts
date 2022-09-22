// Es necesario poder usar un objeto de usuario, así que hemos procedido en vez de creando una interfaz, haciendo una clase, que posee un constructor y que tiene métodos

import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Usuario {

    constructor( public uid: string,
                 public rol: string,
                 public nombre?: string,
                 public apellidos?: string,
                 public email?: string,
                 public alta?: Date,
                 public activo?: boolean,
                 public imagen?: string) {}

    // Función que devuelve el url de la imagen
    get imagenUrl(): string {
        // Devolvemos la imagen en forma de petición a la API
        const token = localStorage.getItem('token') || '';

        // Devolvemos la no imagen y el token para poder visualizarla
        if (!this.imagen) {
            return `${base_url}/uploads/fotoperfil/no-imagen?token=${token}`;
        }

        // Devolvemos la imagen y el token para poder visualizarla
        return `${base_url}/uploads/fotoperfil/${this.imagen}?token=${token}`;
    }
}
