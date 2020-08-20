import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Menu, MenuService } from '../../shared/menu.service';
import { RecetasService } from '../../shared/recetas.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent {
  @Input() menusUsuario: [Menu];
  @Output() editMenuClicked: EventEmitter<Menu> = new EventEmitter<Menu>();

  onEditMenu(i: number): void {
    this.menuService.menuToEdit.next(this.menusUsuario[i]);
  }

  onItemSelect(i: number): void {
    this.menuService.menuSelected.next(this.menusUsuario[i]);
    console.log(this.menusUsuario[i]._id);
    this.recetasService.getMenuRecetas(this.menusUsuario[i]._id);
  }

  constructor(
    private menuService: MenuService,
    private recetasService: RecetasService
  ) {}
}
