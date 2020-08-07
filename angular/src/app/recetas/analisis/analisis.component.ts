import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.component.html',
  styleUrls: ['./analisis.component.scss'],
})
export class AnalisisComponent implements OnInit {
  @Input() analisis;

  constructor() {}

  ngOnInit(): void {}
}
