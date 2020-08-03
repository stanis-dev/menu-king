import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.scss'],
})
export class RecetasComponent implements OnInit {
  recetaNueva: FormGroup = this.fb.group({
    recetaNombre: ['', Validators.required],
    recetaImagen: [''],
    ingredientes: this.fb.array([
      this.fb.group({
        ingrediente: [''],
        ingredienteCantidad: [''],
      }),
    ]),
  });
  formSub: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    /* this.formSub = this.recetaNueva.valueChanges.subscribe((val) => {
      console.log(val);
    }); */
    console.log(this.ingredientes);
  }

  onSubmit() {
    console.log(this.recetaNueva.value);
  }

  onAddIngredient(): void {
    this.ingredientes.push(
      this.fb.group({
        ingrediente: [''],
        ingredienteCantidad: [''],
      })
    );
  }

  onDeleteIngredient(i: number): void {
    this.ingredientes.removeAt(i);
  }

  get ingredientes(): FormArray {
    return this.recetaNueva.get('ingredientes') as FormArray;
  }
}
