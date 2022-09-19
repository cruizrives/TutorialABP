import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  public titulo: string = '';
  // Variable para poder suscribirse y desuscribirse
  private subs$ :Subscription = Subscription.EMPTY;
  public breadcrumbs:any[] = [];

  constructor(private router: Router) {

    // this.coches.push({make: 'Ford'}, {make: 'Fiat'})

  // Me suscribo a los eventos del router
  this.subs$ = this.cargarDatos()
    .subscribe({
      next:(data:any)=> {
        // Este evento contiene snapshots a los que se les van a pasar datos
        this.titulo = data.titulo;
        this.breadcrumbs = data.breadcrumbs;
      }
    })

   }

   // Pero modifico los eventos para filtrarlos
   cargarDatos(){
    return this.router.events
    .pipe(
      filter(ev => ev instanceof ActivationEnd ),
      filter((ev:any) =>  ev.snapshot.firstChild === null),
      map((ev:ActivationEnd) =>ev.snapshot.data)
    )
   }

  ngOnDestroy():void {
    // Cuando se invoca al destructor del componente, me desuscribo
    this.subs$.unsubscribe;
   }

  ngOnInit(): void {
  }

}
