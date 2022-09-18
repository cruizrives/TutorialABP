import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm } from '../interfaces/login-form.interface'
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
      private http: HttpClient
    ) { }


  // El uso de la interfaz loginForm nos es muy útil para tipar el objeto formData
  login (formData: loginForm){
    console.log('Login desde el usuario.service', formData);
    return this.http.post(`${environment.url_api}/login`, formData );
  }

  // Comprueba si el token de la petición es correcto haciendo una llamada a la api con la ruta /login/token
  validarToken(){
    const token = localStorage.getItem('token') || '';
    // Si no hay token devuelve un observable que al final se resuelve a false
    if (token===''){
      return of(false);
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
          }),
          // Y devuelvo true
          map (res =>{
            return true;
          }),
          // Si hay algún error lo muestro
          catchError (err =>{
            console.warn(err);
            return of(false);
          })
        )
  }

}
