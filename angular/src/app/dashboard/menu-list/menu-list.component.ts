import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Menu } from '../menu.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent {
  @Input() menusUsuario: [Menu];
  @Output() editMenuClicked: EventEmitter<Menu> = new EventEmitter<Menu>();

  onEditMenu(i: number): void {
    console.log('clicked!');
    this.editMenuClicked.emit(this.menusUsuario[i]);
  }
}
