import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilsService } from '../shared/utils.service';
import { Menu, MenuService } from '../shared/menu.service';
import { ActivatedRoute } from '@angular/router';
import { RecetasService } from '../shared/recetas.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  menusUsuarioSub: Subscription;
  clickSub: Subscription;
  menuToEditSub: Subscription;
  menusUsuario: [Menu];
  menuToEdit: Menu;

  modoModificarMenu = false;

  private popupMenu: ElementRef;
  @ViewChild('popupMenu', { read: ElementRef, static: false })
  set menuPopup(menuPopup: ElementRef) {
    if (menuPopup) {
      this.popupMenu = menuPopup;
    }
  }

  constructor(
    private utilsService: UtilsService,
    private menuService: MenuService,
    private recetasService: RecetasService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.menuService.getMenus();

    this.menuService.menuToEdit.subscribe((menutoEdit) => {
      if (menutoEdit) {
        this.menuToEdit = menutoEdit;
        this.onModifyMenu();
      }
    });

    this.menusUsuarioSub = this.menuService.userMenus.subscribe(
      (menus: [Menu]) => {
        this.menusUsuario = menus;

        // Iniciar suscripción sólo si existen params en la dir del navegador
        if (this.route.firstChild) {
          this.route.firstChild.paramMap.subscribe((params) => {
            // Seleccionar menu en función del param en la barra de navegación
            const menuId = params.get('menuId');
            const menu = this.menusUsuario[menuId];

            // Emitir el menu seleccionado
            this.menuService.menuSelected.next(menu);
            // Esto carga la parte derecha (lista de recetas) para el menu seleccionado
            this.recetasService.getMenuRecetas(menu._id);
          });
        }
      }
    );
  }

  onModifyMenu(): void {
    this.modoModificarMenu = true;

    this.clickSub = this.utilsService.documentClickedTarget.subscribe(
      (target) => {
        this.closePopupOnClickOutside(target);
      }
    );
  }

  onMenuModified(): void {
    this.modoModificarMenu = false;
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
      this.modoModificarMenu = false;
      this.menuService.menuToEdit.next(null);
      this.clickSub.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.menusUsuarioSub.unsubscribe();

    // TODO: Por qué si lo saco del condicional me tira error?
    if (this.menuToEditSub) {
      this.menuToEditSub.unsubscribe();
    }
  }
}
