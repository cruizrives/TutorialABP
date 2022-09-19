import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';



@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.css']
})
export class ProgressbarComponent implements OnInit {

  // 'valor' es la propiedad pública que obtiene del componente padre y que se pasa a la variable ancho, conectada al progressbar, estableciendo así su tamaño
  // Además, en este caso, la propiedad interna llamada ancho = 25 está poniendo un valor por defecto de manera que si a valor no le llega ningún parámetro el progressbar se creará con 25
  @Input('valor') ancho = 25;

  // Emite el evento al componente dashboard
  @Output('incrementar') salida:EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  // La salida de acción llamada desde el componente progressbar se emitirá al output con el evento
  accion(){
    // Sumamos uno cada vez que se clique en el componente progressbar y se envía un console.log al padre
    this.ancho+=1;
    this.salida.emit(1);
  }

  eventoIncrementar(valor:number){

  }

}
