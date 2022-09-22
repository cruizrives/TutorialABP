import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // Variable para cambiar la imagen del navbar
  imagenUrl = '';

  // Para conectarlo con el método de logout de usuarioService
  constructor(private usuarioService:UsuarioService) { }

  // Llamamos al método de cargar usuario
  ngOnInit() :void{
    this.usuarioService.cargarUsuario(this.usuarioService.uid).subscribe({
      next: (res:any) => {
        // En la foto falta el token de autorización para poder ver la imagen
        this.imagenUrl = this.usuarioService.imagenURL;

        // Ya no hace falta dado que el getter del modelo de usuario se encarga de crear el enlace
        // this.imagenUrl = `${environment.base_url}/uploads/fotoperfil/${res["usuarios"].imagen || 'no-imagen'}`;
        // // Enlazamos el token
        // this.imagenUrl+= `?token=${this.usuarioService.token}`;
      },
      error: err => {
        console.log(err);
      }
    })

  }



  logout(){
    this.usuarioService.logout();
  }



}
