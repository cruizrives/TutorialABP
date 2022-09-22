import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../commons/sidebar/sidebar.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { NavbarComponent } from '../commons/navbar/navbar.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../commons/breadcrumb/breadcrumb.component';
import { ProgressbarComponent } from '../components/progressbar/progressbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { DashboardprofComponent } from './prof/dashboardprof/dashboardprof.component';
import { DashboardaluComponent } from './alu/dashboardalu/dashboardalu.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PaginationComponent } from '../components/progressbar/pagination/pagination.component';



@NgModule({
  declarations: [
    AdminLayoutComponent,
    SidebarComponent,
    NavbarComponent,
    DashboardComponent,
    UsuariosComponent,
    BreadcrumbComponent,
    ProgressbarComponent,
    UsuarioComponent,
    DashboardprofComponent,
    DashboardaluComponent,
    PerfilComponent,
    PaginationComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
