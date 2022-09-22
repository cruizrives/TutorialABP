import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm } from '../interfaces/login-form.interface'
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // private usuario: Usuario = new Usuario(this.uid, this.rol);
  private usuario: Usuario | any;


  constructor(
      private http: HttpClient,
      private router: Router,
    ) { }

  // El uso de la interfaz loginForm nos es muy útil para tipar el objeto formData
  login (formData: loginForm){

    console.log('Login desde el usuario.service', formData);
    return this.http.post(`${environment.base_url}/login`, formData )
    .pipe(
      tap((result:any)=>{
          localStorage.setItem('token', result.token);
          // localStorage.setItem('rol', result.rol);
      })
    )

  }

  // Eliminar el token del usuario
  logout() {
    this.limpiarLocalStore();
    this.router.navigateByUrl('/login');
  }

  // Generalizamos las funciones de validarToken y validarNoToken
  // Ahora especificamos qué queremos devolver cuando la función sea correcta o incorrecta
  validar(correcto:boolean, incorrecto:boolean):Observable<boolean>{
    const token = localStorage.getItem('token') || '';

    if (token===''){
      this.limpiarLocalStore();
      return of(incorrecto);
    }
    // Si lo hay hago la llamada y con la respuesta
    return this.http.get(`${environment.base_url}/login/token`, {
        headers: {
          'x-token': token
        // Opero con la respuesta
        }})
        .pipe(
          // Almaceno el nuevo token en localStorage
          tap( (res:any) => {

            // Extraemoos los datos que nos devuelve la petición de validar el token para poder crear el objeto usuario
            const { _id, nombre, apellidos, email, rol, alta, activo, imagen, token} = res;
            localStorage.setItem('token', res.token);
            // localStorage.setItem('rol', res.rol);
            this.usuario = new Usuario(_id, rol, nombre, apellidos, email, alta, activo, imagen);
          }),
          map (res =>{
            return correcto;
          }),
          // Si hay algún error lo muestro
          catchError (err =>{
            console.warn(err);
            // Si no pongo esto, en el caso de que el usuario se haya validado con un token y se caiga el servidor, al refrescar la página, se lanzaría la petición para comprobar la validez del token que fallaría, pero también la del no token, por ello si quitamos el token al surgir un error, al menos nos aseguramos de que solo se lance una vez la petición
            this.limpiarLocalStore();
            return of(incorrecto);
          })
        )
  }


  // Comprueba si el token de la petición es correcto haciendo una llamada a la api con la ruta /login/token
  validarToken():Observable<boolean>{

    // Si no hay token devuelvo false, si lo hay true
    return this.validar(true, false);

    // const token = localStorage.getItem('token') || '';
    // // Si no hay token devuelve un observable que al final se resuelve a false
    // if (token===''){
    //   return of(false);
    // }
    // // Si lo hay hago la llamada y con la respuesta
    // return this.http.get(`${environment.base_url}/login/token`, {
    //     headers: {
    //       'x-token': token
    //     // Opero con la respuesta
    //     }})
    //     .pipe(
    //       // Almaceno el nuevo token en localStorage
    //       tap( (res:any) => {
    //         localStorage.setItem('token', res.token);
    //       }),
    //       // Y devuelvo true
    //       map (res =>{
    //         return true;
    //       }),
    //       // Si hay algún error lo muestro
    //       catchError (err =>{
    //         console.warn(err);
    //         // Si no pongo esto, en el caso de que el usuario se haya validado con un token y se caiga el servidor, al refrescar la página, se lanzaría la petición para comprobar la validez del token que fallaría, pero también la del no token, por ello si quitamos el token al surgir un error, al menos nos aseguramos de que solo se lance una vez la petición
    //         localStorage.removeItem('token');
    //         return of(false);
    //       })
    //     )
  }

  // Comprueba si no hay token haciendo una llamada a la api con la ruta /login/token
  validarNoToken():Observable<boolean>{
    // Si no hay token devuelvo true, si lo hay false
    return this.validar(false, true);
  }

  limpiarLocalStore(){
    localStorage.removeItem('token');
    // localStorage.removeItem('rol');
  }

  // Hace la petición get del usuario pasado por la id
  // El objeto this.cabeceras es un getter que dentro de una clase,  funcionan como una propiedad más, así que no se les pone paréntesis para invocarlos
  cargarUsuario( uid: string) {
    if (!uid)
    { uid = '';}
    return this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras);
  }

  nuevoUsuario ( data: Usuario) {
    return this.http.post(`${environment.base_url}/usuarios/`, data, this.cabeceras);
  }

  actualizarUsuario ( uid: string, data: Usuario) {
    return this.http.put(`${environment.base_url}/usuarios/${uid}`, data, this.cabeceras);
  }

  cambiarPassword( uid: string, data:any) {
    return this.http.put(`${environment.base_url}/usuarios/np/${uid}`, data, this.cabeceras);
  }

  subirFoto( uid: string, foto: File) {
    const url = `${environment.base_url}/upload/fotoperfil/${uid}`;
    const datos: FormData = new FormData();
    datos.append('archivo', foto, foto.name);
    return this.http.post(`${environment.base_url}/upload/fotoperfil/${uid}`, datos, this.cabeceras);
  }


  cargarUsuarios( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/usuarios/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  borrarUsuario( uid: string) {
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/usuarios/${uid}` , this.cabeceras);
  }
  establecerimagen(nueva: string): void {
    this.usuario.imagen = nueva;
  }

  establecerdatos(nombre: string, apellidos: string, email: string): void {
    this.usuario.nombre = nombre;
    this.usuario.apellidos = apellidos;
    this.usuario.email = email;
  }



  // Getters
  get cabeceras():any{
    return {
      headers:{
        'x-token': this.token
      }
    }
  }

  get token():string | null{
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid;
  }

  get rol(): string {
    return this.usuario.rol;
  }

  get nombre(): string{
    return this.usuario.nombre;
  }

  get apellidos(): string{
    return this.usuario.apellidos;
  }

  get email(): string{
    return this.usuario.email;
  }

  get imagen(): string{
    return this.usuario.imagen;
  }

  get imagenURL(): string{
    return this.usuario.imagenUrl;
  }
}
