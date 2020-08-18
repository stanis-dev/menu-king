import { Component, OnInit } from '@angular/core';
import { Menu, MenuService } from '../menu.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-datos-nutricionales',
  templateUrl: './datos-nutricionales.component.html',
  styleUrls: ['./datos-nutricionales.component.scss'],
})
export class DatosNutricionalesComponent implements OnInit {
  menuSelected: Menu;

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.menuService.menuSelected.subscribe((menu) => {
      if (menu) {
        this.menuSelected = menu;
      }
    });
  }
}
