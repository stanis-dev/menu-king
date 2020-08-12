import { Component, OnInit } from '@angular/core';
import { RecetasService } from '../recetas/recetas.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  numRecetas: number;
  recetas: [];

  constructor(private recetasService: RecetasService) {}

  ngOnInit(): void {
    this.recetasService.getRecetas().subscribe((recetas) => {
      console.log(recetas);
    });
  }
}
