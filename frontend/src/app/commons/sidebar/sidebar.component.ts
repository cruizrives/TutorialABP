import { Component, OnInit } from '@angular/core';
import { sidebarItem } from 'src/app/interfaces/sidebar.interface';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    private sidebar: SidebarService
  ) { }

  // Tipamos la variable menu
  menu?: sidebarItem[] = [];

  ngOnInit(): void {
    this.menu = this.sidebar.getMenu();
    // console.log(this.menu);
  }

}
