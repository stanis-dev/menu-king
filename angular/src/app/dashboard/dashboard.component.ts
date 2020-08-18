import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilsService } from '../shared/utils.service';
import { Menu, MenuService } from './menu.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  menusUsusarioSub: Subscription;
  clickSub: Subscription;
  menusUsuario: [Menu];
  menuActivo;
  modoModificarMenu: string;

  private popupMenu: ElementRef;
  @ViewChild('popupMenu', { read: ElementRef, static: false })
  set menuPopup(menuPopup: ElementRef) {
    if (menuPopup) {
      this.popupMenu = menuPopup;
    }
  }

  constructor(
    private utilsService: UtilsService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.menusUsusarioSub = this.menuService.getMenus().subscribe((menus) => {
      this.menusUsuario = menus.data;
      this.menuActivo = menus.data[0];
      console.log(this.menusUsuario);
    });
  }

  onCreateMenu(mode: string): void {
    this.modoModificarMenu = mode;

    this.clickSub = this.utilsService.documentClickedTarget.subscribe(
      (target) => {
        this.closePopupOnClickOutside(target);
      }
    );
  }

  onMenuModified(menuEmmitted: Menu): void {
    this.menusUsuario.push(menuEmmitted);
    this.modoModificarMenu = undefined;
  }

  closePopupOnClickOutside(target: any): void {
    if (
      this.popupMenu.nativeElement.contains(target) ||
      target.classList.contains('createMenuButton') ||
      target.classList.contains('edit-icon-svg')
    ) {
      return;
    } else {
      console.log('a closing link detected');
      this.modoModificarMenu = undefined;
      this.clickSub.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.menusUsusarioSub.unsubscribe();
  }
}
