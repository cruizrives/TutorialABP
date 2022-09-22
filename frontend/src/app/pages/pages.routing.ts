import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { PerfilComponent } from './perfil/perfil.component';

// Inicialmente las rutas eran así:
// {
//   path: 'admin', component: AdminLayoutComponent, // /admin
//   children: [
//     { path: 'usuarios', component: UsuariosComponent }, // /admin/usuarios
//     { path: 'dashboard', component: DashboardComponent} // /admin/dashboard
//   ]
// }
// Hay que mejorarlas para que queden así:

// dashboard           --> admin-layer/dashboard
// dashboard/usuarios  --> admin-layer/usurios
// dashboard/*         --> admin-layer/dashboard

// La última versión de las rutas sería

const routes: Routes = [


    // La guarda va a devolver un true o un false
    // Cuando se invoca cualquiera de las rutas dashboard se llama a la guarda
    // Las guardas son observables que al final tienen que devolver true o false
  {
    path: 'perfil', component: AdminLayoutComponent, canActivate: [ AuthGuard ], data: {rol: '*'},
    children: [
      { path: '', component: PerfilComponent, data: {
                                    titulo: 'Perfil',
                                    breadcrums: []
                                  },},
    ]
  },


  {
    path:'dashboard', component: AdminLayoutComponent, canActivate: [AuthGuard],
    children: [

      // Si pongo dashboard y nada más me lleva al dashboard
      {path:'', component: DashboardComponent, data: {
        titulo: 'Dashboard',
        breadcrumbs:[] // En breadcrums indicamos el elemento que va antes
      }},

      {path:'usuarios', component: UsuariosComponent, data: {
        titulo: 'Usuarios',
        breadcrumbs:[ {titulo: 'Dashboard', url:'/dashboard'}]

      }},

      {path:'usuario', component: UsuarioComponent, data: {
        titulo: 'Usuario',
        breadcrumbs:[ {titulo: 'Dashboard', url:'/dashboard'}]

      }},

      {path:'**', redirectTo:''},
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class PagesRoutingModule { }
