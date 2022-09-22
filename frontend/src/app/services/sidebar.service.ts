import { Injectable } from '@angular/core';
import { sidebarItem } from '../interfaces/sidebar.interface';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menuAdmin: sidebarItem[] = [
    {titulo: 'Dashboard admin', icono:'fa fa-tachometer-alt', sub: false, url: '/admin/dashboard'},
    { titulo: 'Gestión usuarios', icono: 'mdi mdi-arrow-down', sub: true, subMenu: [
      { titulo: 'Usuarios', icono: 'fa fa-users', url: '/admin/usuarios'},
      { titulo: 'Usuario', icono: 'fa fa-user', url: '/admin/usuarios/usuario/:uid'},
    ]

  },
  ];


  menuProf: sidebarItem[] = [
    {titulo: 'Dashboard profesores', icono:'fa fa-tachometer-alt', sub: false, url: 'prof/dashboard'},
  ];

  menuAlu: sidebarItem[] = [
    {titulo: 'Dashboard alumno', icono:'fa fa-tachometer-alt', sub: false, url: 'alu/dashboard'},
  ];

  none: sidebarItem[]=[
    { titulo: 'error', icono: 'fa fa-exclamation-triangle', sub: false, url: '/error'}]

  constructor(private usuarioService: UsuarioService) { }

  getMenu(){


    switch (this.usuarioService.rol) {
      case 'ADMIN':
        return this.menuAdmin;
      case 'PROFESOR':
        return this.menuProf;
      case 'ALUMNO':
        return this.menuAlu;
    }

    return [];
  }
}
