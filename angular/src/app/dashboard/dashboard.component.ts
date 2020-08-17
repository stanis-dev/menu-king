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
  modoCrearMenu = false;
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
      console.log(this.menusUsuario);
    });
  }

  onCreateMenu(): void {
    this.modoCrearMenu = true;

    this.clickSub = this.utilsService.documentClickedTarget.subscribe(
      (target) => {
        this.closePopupOnClickOutside(target);
      }
    );
  }

  onMenuModified(menuEmmitted: Menu): void {
    console.log(menuEmmitted);
    this.menusUsuario.push(menuEmmitted);
    this.modoCrearMenu = false;
  }

  closePopupOnClickOutside(target: any): void {
    if (
      this.popupMenu.nativeElement.contains(target) ||
      target.classList.contains('createMenuButton')
    ) {
      return;
    } else {
      console.log('clicked');
      this.modoCrearMenu = false;
      this.clickSub.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.menusUsusarioSub.unsubscribe();
  }
}
