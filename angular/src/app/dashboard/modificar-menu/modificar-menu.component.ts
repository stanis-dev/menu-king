import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Menu, MenuService } from '../menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modificar-menu',
  templateUrl: './modificar-menu.component.html',
  styleUrls: ['./modificar-menu.component.scss'],
})
export class ModificarMenuComponent implements OnInit, OnDestroy {
  @Output() menuHasBeenModified: EventEmitter<void> = new EventEmitter<void>();
  menuToEdit: Menu;
  sub: Subscription;

  menuForm: FormGroup = this.fb.group({
    menuName: ['', Validators.required],
    pax: [0, [Validators.required, Validators.min(1)]],
  });

  constructor(private fb: FormBuilder, private menuService: MenuService) {}

  ngOnInit(): void {
    this.sub = this.menuService.menuToEdit.subscribe((menu) => {
      if (menu) {
        console.log(menu);
        this.menuToEdit = menu;

        this.menuForm.patchValue({
          menuName: this.menuToEdit.menuName,
          pax: this.menuToEdit.pax,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.menuToEdit) {
      if (this.menuForm.dirty) {
        this.menuService
          .patchMenu(this.menuToEdit._id, {
            menuName: this.menuForm.value.menuName,
            pax: this.menuForm.value.pax,
          })
          .subscribe(() => {
            this.menuService.getMenus();
            this.menuHasBeenModified.emit();
          });
      }
    } else {
      this.menuService.saveMenu(this.menuForm.value);
    }

    this.menuHasBeenModified.emit();
  }

  onDeleteMenu(): void {
    this.menuService.deleteMenu(this.menuToEdit._id);
    this.menuHasBeenModified.emit();
    this.menuService.menuToEdit.next(null);
  }

  ngOnDestroy(): void {
    this.menuService.menuToEdit.next(null);
    this.sub.unsubscribe();
  }
}
