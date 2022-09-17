import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';


// Inicialmente las rutas eran así:
// {
//   path: 'auth', component: AuthLayoutComponent, // /auth
//   children: [
//   { path: 'login', component: LoginComponent }, //  /auth/login
//   { path: 'recovery', component: RecoveryComponent} //  /auth/recovery
//   ]
// },
// Hay que mejorarlas para que queden así:

// login               --> auth-layer/login
// recovery            --> auth-layer/recovery
// /*                  --> auth-layer/login

const routes: Routes = [
  {
    path:'login', component: AuthLayoutComponent,
    children: [
      // Si pongo login y nada más me lleva al login
      {path:'', component: LoginComponent},
    ]
  },
  {
    path:'recovery', component: AuthLayoutComponent,
    children: [
      // Si pongo recovery y nada más me lleva al recovery
      {path:'', component: RecoveryComponent},
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})




export class AuthRoutingModule { }
