import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Menu, MenuService } from '../menu.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-crear-menu',
  templateUrl: './crear-menu.component.html',
  styleUrls: ['./crear-menu.component.scss'],
})
export class CrearMenuComponent {
  @Output()
  menuHasBeenModified: EventEmitter<Menu> = new EventEmitter<Menu>();

  menuForm: FormGroup = this.fb.group({
    menuName: ['', Validators.required],
    pax: [0, [Validators.required]],
  });

  onSubmit(): void {
    this.menuService.saveMenu(this.menuForm.value).subscribe((response) => {
      console.log(response.data);
      this.menuHasBeenModified.emit(response.data);
    });
  }

  constructor(private fb: FormBuilder, private menuService: MenuService) {}
}
