import { Component, OnInit } from '@angular/core';
import { Menu, MenuService } from '../../shared/menu.service';

@Component({
  selector: 'app-datos-nutricionales',
  templateUrl: './datos-nutricionales.component.html',
  styleUrls: ['./datos-nutricionales.component.scss'],
})
export class DatosNutricionalesComponent implements OnInit {
  menuSelected: Menu;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.menuSelected.subscribe((menu) => {
      if (menu) {
        this.menuSelected = menu;
      }
    });
  }
}
