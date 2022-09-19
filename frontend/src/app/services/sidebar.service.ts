import { Injectable } from '@angular/core';
import { sidebarItem } from '../interfaces/sidebar.interface';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menuAdmin: sidebarItem[] = [
    {titulo: 'Dashboard admin', icono:'mdi mdi-view-dashboard', sub: false, url: '/dashboard'},
    {titulo: 'Usuarios', icono:'mdi mdi-account', sub: false, url: '/dashboard/usuarios'},
    {titulo: 'Otro', icono:'mdi mdi-multiplication', sub: false, url: '/dashboard/otro'},
    {titulo: 'Submenu', icono:'mdi mdi-arrow-down', sub: true, subMenu: [
      {titulo: 'Opción 1', icono: 'mdi mdi-numeric-1-box-outline', url: 'dashboard/uno'},
      {titulo: 'Opción 2', icono: 'mdi mdi-numeric-2-box-outline', url: 'dashboard/dos'},
    ]}
  ];

  menuProf: sidebarItem[] = [
    {titulo: 'Dashboard profesor', icono:'mdi mdi-view-dashboard', sub: false, url: '/dashboard'},
    {titulo: 'Usuarios', icono:'mdi mdi-account', sub: false, url: '/dashboard/usuarios'},
    {titulo: 'Otro', icono:'mdi mdi-multiplication', sub: false, url: '/dashboard/otro'},
    {titulo: 'Submenu', icono:'mdi mdi-arrow-down', sub: true, subMenu: [
      {titulo: 'Opción 1', icono: 'mdi mdi-numeric-1-box-outline', url: 'dashboard/uno'},
      {titulo: 'Opción 2', icono: 'mdi mdi-numeric-2-box-outline', url: 'dashboard/dos'},
    ]}
  ];

  menuAlu: sidebarItem[] = [
    {titulo: 'Dashboard alumno', icono:'mdi mdi-view-dashboard', sub: false, url: '/dashboard'},
    {titulo: 'Usuarios', icono:'mdi mdi-account', sub: false, url: '/dashboard/usuarios'},
    {titulo: 'Otro', icono:'mdi mdi-multiplication', sub: false, url: '/dashboard/otro'},
    {titulo: 'Submenu', icono:'mdi mdi-arrow-down', sub: true, subMenu: [
      {titulo: 'Opción 1', icono: 'mdi mdi-numeric-1-box-outline', url: 'dashboard/uno'},
      {titulo: 'Opción 2', icono: 'mdi mdi-numeric-2-box-outline', url: 'dashboard/dos'},
    ]}
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
