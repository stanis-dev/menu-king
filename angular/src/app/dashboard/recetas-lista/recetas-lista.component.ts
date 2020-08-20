import { Component, OnInit } from '@angular/core';
import { Menu, MenuService } from '../../shared/menu.service';

@Component({
  selector: 'app-recetas-lista',
  templateUrl: './recetas-lista.component.html',
  styleUrls: ['./recetas-lista.component.scss'],
})
export class RecetasListaComponent implements OnInit {
  menuSelected: Menu;

  ngOnInit() {
    this.menuService.menuSelected.subscribe((menu) => {
      this.menuSelected = menu;
    });
  }

  constructor(private menuService: MenuService) {}
}
