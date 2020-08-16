import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RecetasService } from '../recetas/recetas.service';
import { Subscription } from 'rxjs';
import { UtilsService } from '../shared/utils.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  recetasUsusarioSub: Subscription;
  clickSub: Subscription;
  recetas: [];
  modoCrearMenu = false;
  private popupMenu: ElementRef;
  @ViewChild('popupMenu', { read: ElementRef, static: false })
  set menuPopup(menuPopup: ElementRef) {
    if (menuPopup) {
      this.popupMenu = menuPopup;
    }
  }

  constructor(
    private recetasService: RecetasService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.recetasUsusarioSub = this.recetasService
      .getRecetas()
      .subscribe((recetas) => {
        console.log(recetas);
      });
  }

  onCreateMenu(): void {
    console.log('executed');
    console.log('before: ' + this.modoCrearMenu);
    this.modoCrearMenu = true;
    console.log('after: ' + this.modoCrearMenu);

    this.clickSub = this.utilsService.documentClickedTarget.subscribe(
      (target) => {
        this.closePopupOnClickOutside(target);
      }
    );
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
    this.recetasUsusarioSub.unsubscribe();
  }
}
