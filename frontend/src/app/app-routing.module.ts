import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routing';


// login y recovery --> authModule
// dashboard -->  adminModule

const routes: Routes = [
  {path:'**', redirectTo:'login'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes), PagesRoutingModule, AuthRoutingModule],
  exports: [RouterModule]
})


export class AppRoutingModule { }
