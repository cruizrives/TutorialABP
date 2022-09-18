import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm } from '../interfaces/login-form.interface'

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
    return this.http.post('http://localhost:3000/api/login', formData );
  }
}
