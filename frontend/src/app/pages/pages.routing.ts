import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AuthGuard } from '../guards/auth.guards';

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

const routes: Routes = [

  {

    // La guarda va a devolver un true o un false
    // Cuando se invoca cualquiera de las rutas dashboard se llama a la guarda
    // Las guardas son observables que al final tienen que devolver true o false
    path:'dashboard', component: AdminLayoutComponent, canActivate: [AuthGuard],
    // path:'dashboard', component: AdminLayoutComponent,
    children: [
      // Si pongo dashboard y nada más me lleva al dashboard
      {path:'', component: DashboardComponent},
      {path:'usuarios', component: UsuariosComponent},
      {path:'**', redirectTo:''},
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class PagesRoutingModule { }