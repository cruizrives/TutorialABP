import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Angular puede generar un unsafe para prevenir que nadie acceda y descargue alguien por error, pero en mi caso no ha ocurrido
  authUrl = '?token=' + this.usuarioService.token;
  constructor(private usuarioService:UsuarioService) { }

  ngOnInit(): void {
  }

  eventoEmitido(valor:number){
    console.log("Evento emitido, se ha incrementado el progress bar", valor, "unidad");
  }

}
