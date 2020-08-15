import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecetasService } from '../recetas/recetas.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  recetasUsusarioSub: Subscription;
  numRecetas: number;
  recetas: [];
  modoCrearMenu = true;

  constructor(private recetasService: RecetasService) {}

  ngOnInit(): void {
    this.recetasUsusarioSub = this.recetasService
      .getRecetas()
      .subscribe((recetas) => {
        console.log(recetas);
      });
  }

  ngOnDestroy(): void {
    this.recetasUsusarioSub.unsubscribe();
  }
}
