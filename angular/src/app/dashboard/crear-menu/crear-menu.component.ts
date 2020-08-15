import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-crear-menu',
  templateUrl: './crear-menu.component.html',
  styleUrls: ['./crear-menu.component.scss'],
})
export class CrearMenuComponent {
  menuForm = this.fb.group({
    menuName: [''],
    menuPersonas: [0],
  });

  constructor(private fb: FormBuilder) {}
}
