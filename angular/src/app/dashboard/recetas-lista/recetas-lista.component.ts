import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recetas-lista',
  templateUrl: './recetas-lista.component.html',
  styleUrls: ['./recetas-lista.component.scss'],
})
export class RecetasListaComponent implements OnInit {
  @Input() menuActivo;

  ngOnInit() {
    console.log(this.menuActivo);
  }
}
