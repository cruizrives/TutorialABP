import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router){}

  // Se suscribe al validarToken y en caso de que la respuesta
  canActivate(
    route: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot){

    // Le quitamos el tipado
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Comprobamos si hay token
    return this.usuarioService.validarNoToken()
    // Recibe la respuesta con el pipe y opera con ella
      .pipe(
        // Ejecuta operaciones secundarias
        tap( resp=>{
          // Si no se recibe respuesta, es decir conseguimos un error, significa que no queremos dejar que el usuario navegue por las rutas de login porque ha sido validado
          if (!resp){

              switch (this.usuarioService.rol) {
                case 'ADMIN':
                  this.router.navigateByUrl('/admin/dashboard');
                  break;
                case 'ALUMNO':
                  this.router.navigateByUrl('/alu/dashboard');
                  break;
                case 'PROFESOR':
                  this.router.navigateByUrl('/prof/dashboard');
                  break;
              }

            // this.router.navigateByUrl('/dashboard')
          }
        })
      );
  }

}
