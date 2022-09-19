import { Injectable } from '@angular/core';
import { sidebarItem } from '../interfaces/sidebar.interface';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menuAdmin: sidebarItem[] = [
    {titulo: 'Dashboard admin', icono:'mdi mdi-view-dashboard', sub: false, url: '/dashboard'},
    {titulo: 'Gestión de usuarios', icono:'mdi mdi-arrow-down', sub: true, subMenu: [
      {titulo: 'Usuarios', icono: 'mdi mdi-account', url: '/dashboard/usuarios'},
      {titulo: 'Opción 2', icono: 'mdi mdi-numeric-2-box-outline', url: 'dashboard/dos'},
    ]},
    {titulo: 'Otro', icono:'mdi mdi-multiplication', sub: false, url: '/dashboard/otro'}
  ];

  menuProf: sidebarItem[] = [
    {titulo: 'Dashboard profesores', icono:'mdi mdi-view-dashboard', sub: false, url: '/dashboard'},
    {titulo: 'Gestión de usuarios', icono:'mdi mdi-arrow-down', sub: true, subMenu: [
      {titulo: 'Usuarios', icono: 'mdi mdi-account', url: '/dashboard/usuarios'},
      {titulo: 'Opción 2', icono: 'mdi mdi-numeric-2-box-outline', url: 'dashboard/dos'},
    ]},
    {titulo: 'Otro', icono:'mdi mdi-multiplication', sub: false, url: '/dashboard/otro'}
  ];

  menuAlu: sidebarItem[] = [
    {titulo: 'Dashboard alumno', icono:'mdi mdi-view-dashboard', sub: false, url: '/dashboard'},
    {titulo: 'Gestión de usuarios', icono:'mdi mdi-arrow-down', sub: true, subMenu: [
      {titulo: 'Usuarios', icono: 'mdi mdi-account', url: '/dashboard/usuarios'},
      {titulo: 'Opción 2', icono: 'mdi mdi-numeric-2-box-outline', url: 'dashboard/dos'},
    ]},
    {titulo: 'Otro', icono:'mdi mdi-multiplication', sub: false, url: '/dashboard/otro'}
  ];

  constructor() { }

  getMenu(){

    const rol = localStorage.getItem('rol');

    switch (rol) {
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
