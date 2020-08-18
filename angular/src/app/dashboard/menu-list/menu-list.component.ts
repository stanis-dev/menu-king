import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Menu, MenuService } from '../menu.service';

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
  }

  constructor(private menuService: MenuService) {}
}
