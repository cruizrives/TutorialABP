import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../commons/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { NavbarComponent } from '../commons/navbar/navbar.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    DashboardComponent,
    AdminLayoutComponent,
    UsuariosComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class PagesModule { }
