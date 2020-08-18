import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Menu, MenuService } from '../menu.service';

@Component({
  selector: 'app-modificar-menu',
  templateUrl: './modificar-menu.component.html',
  styleUrls: ['./modificar-menu.component.scss'],
})
export class ModificarMenuComponent implements OnInit, OnDestroy {
  @Output() menuHasBeenModified: EventEmitter<Menu> = new EventEmitter<Menu>();
  @Input() menuToEdit: Menu;

  menuForm: FormGroup = this.fb.group({
    menuName: ['', Validators.required],
    pax: [0, [Validators.required, Validators.min(1)]],
  });

  onSubmit(): void {
    if (this.menuToEdit) {
      console.log(this.menuForm.value);
    } else {
      this.menuService.saveMenu(this.menuForm.value).subscribe((response) => {
        console.log(response.data);
        this.menuHasBeenModified.emit(response.data);
      });
    }
  }

  constructor(private fb: FormBuilder, private menuService: MenuService) {}

  ngOnInit(): void {
    if (this.menuToEdit) {
      this.menuForm.patchValue({
        menuName: this.menuToEdit.menuName,
        pax: this.menuToEdit.pax,
      });
    }
  }

  ngOnDestroy(): void {
    this.menuToEdit = null;
  }
}
