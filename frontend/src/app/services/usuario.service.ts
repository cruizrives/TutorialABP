import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm } from '../interfaces/login-form.interface'
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
      private http: HttpClient,
      private router: Router
    ) { }


  // El uso de la interfaz loginForm nos es muy útil para tipar el objeto formData
  login (formData: loginForm){
    console.log('Login desde el usuario.service', formData);
    return this.http.post(`${environment.url_api}/login`, formData )
    .pipe(
      tap((result:any)=>{
          localStorage.setItem('token', result.token);
          localStorage.setItem('rol', result.rol);
      })
    )
  }

  // Eliminar el token del usuario
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigateByUrl('/login');
  }

  // Generalizamos las funciones de validarToken y validarNoToken
  // Ahora especificamos qué queremos devolver cuando la función sea correcta o incorrecta
  validar(correcto:boolean, incorrecto:boolean):Observable<boolean>{
    const token = localStorage.getItem('token') || '';

    if (token===''){
      return of(incorrecto);
    }
    // Si lo hay hago la llamada y con la respuesta
    return this.http.get(`${environment.url_api}/login/token`, {
        headers: {
          'x-token': token
        // Opero con la respuesta
        }})
        .pipe(
          // Almaceno el nuevo token en localStorage
          tap( (res:any) => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('rol', res.rol);
          }),
          map (res =>{
            return correcto;
          }),
          // Si hay algún error lo muestro
          catchError (err =>{
            console.warn(err);
            // Si no pongo esto, en el caso de que el usuario se haya validado con un token y se caiga el servidor, al refrescar la página, se lanzaría la petición para comprobar la validez del token que fallaría, pero también la del no token, por ello si quitamos el token al surgir un error, al menos nos aseguramos de que solo se lance una vez la petición
            localStorage.removeItem('token');
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
    // return this.http.get(`${environment.url_api}/login/token`, {
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
}
