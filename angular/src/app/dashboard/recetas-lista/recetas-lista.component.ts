import { Component, OnDestroy, OnInit } from '@angular/core';
import { Menu, MenuService } from '../../shared/menu.service';
import { RecetasService } from '../../shared/recetas.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recetas-lista',
  templateUrl: './recetas-lista.component.html',
  styleUrls: ['./recetas-lista.component.scss'],
})
export class RecetasListaComponent implements OnInit, OnDestroy {
  menuSelected: Menu;
  recetaSub: Subscription;
  menuSub: Subscription;
  entrantes;
  principales;
  postres;

  ngOnInit() {
    this.menuService.menuSelected.subscribe((menu) => {
      this.menuSelected = menu;
    });

    this.recetaSub = this.recetasService.recetasMenu.subscribe((recetas) => {
      this.principales = recetas.principal;
      this.entrantes = recetas.entrante;
      this.postres = recetas.postre;
    });
  }

  onAddReceta(comida: string): void {
    this.router.navigate(['recetas'], {
      queryParams: { menuId: this.menuSelected._id, comida },
    });
  }

  onEditReceta(id: string): void {
    this.router.navigate([`../recetas/${id}`], { relativeTo: this.route });
  }

  ngOnDestroy() {
    if (this.recetaSub) {
      this.recetaSub.unsubscribe();
    }

    if (this.menuSub) {
      this.menuSub.unsubscribe();
    }
  }

  constructor(
    private menuService: MenuService,
    private recetasService: RecetasService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
}
