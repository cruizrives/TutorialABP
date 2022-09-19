import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  eventoEmitido(valor:number){
    console.log("Evento emitido, se ha incrementado el progress bar", valor, "unidad");
  }

}
