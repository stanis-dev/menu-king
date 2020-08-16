import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-menu',
  templateUrl: './crear-menu.component.html',
  styleUrls: ['./crear-menu.component.scss'],
})
export class CrearMenuComponent {
  menuForm: FormGroup = this.fb.group({
    menuName: ['', Validators.required],
    menuPersonas: [0, [Validators.required]],
  });

  constructor(private fb: FormBuilder) {}
}
