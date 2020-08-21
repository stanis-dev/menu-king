import { Component, OnInit } from '@angular/core';
import { Menu, MenuService } from '../../shared/menu.service';
import { RecetasService } from '../../shared/recetas.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recetas-lista',
  templateUrl: './recetas-lista.component.html',
  styleUrls: ['./recetas-lista.component.scss'],
})
export class RecetasListaComponent implements OnInit {
  menuSelected: Menu;
  recetaSub: Subscription;
  entrantes;
  principales;
  postres;

  ngOnInit() {
    this.menuService.menuSelected.subscribe((menu) => {
      this.menuSelected = menu;
    });

    this.recetaSub = this.recetasService.recetasMenu.subscribe((recetas) => {
      console.log(recetas);
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

  constructor(
    private menuService: MenuService,
    private recetasService: RecetasService,
    private router: Router
  ) {}
}
