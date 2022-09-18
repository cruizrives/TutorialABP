import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router){}

  // Se suscribe al validarToken y en caso de que la respuesta
  canActivate(
    route: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot){

    // Le quitamos el tipado
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Podríamos hacer esto, pero realmente el objeto guard en pages.routing ya está actuando como observable así que vamos a usar otro método
    // this.usuarioService.validarToken().subscribe({
    //   next: (result:any) => {
    //     console.log("Dentro del subscribe", result);
    //   },});

    // Llamamos a la función validarToken y después indicamos que debe realizar otras operaciones con el pipe y tap, porque si la función envía false, lo que ocurre es que se queda atascada en la ruta y aunque no muestra las páginas de dashboard, tampoco avanza a la redirección
    return this.usuarioService.validarToken()
    // Recibe la respuesta con el pipe y opera con ella
      .pipe(
        // Ejecuta operaciones secundarias
        tap( resp=>{
          // Si no se recibe respuesta, es decir conseguimos un error, significa que no queremos dejar que el usuario navegue por las rutas de la web porque no ha sido validado
          if (!resp){
            this.router.navigateByUrl('/login')
          }
        })
      );
  }

}
