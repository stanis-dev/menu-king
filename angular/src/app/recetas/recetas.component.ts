import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import {Subscriber, Subscription} from 'rxjs';
import { RecetasService } from './recetas.service';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.scss'],
})
export class RecetasComponent implements OnInit, OnDestroy {
  analisys;
  recetaForm: FormGroup = this.fb.group({
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
  recetaSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private recetasService: RecetasService
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const recetaAnalizada = {
      ...this.recetaForm.value,
      analisisNutricional: { ...this.analisys },
    };

    this.recetaSub = this.recetasService
      .saveReceta(recetaAnalizada)
      .subscribe((receta) => {
        console.log(receta);
      });
  }

  onAnalize(): void {
    let ingr = [];
    this.recetaForm.value.ingredientes.map((ingrediente) => {
      ingr.push(
        `${ingrediente.ingredienteCantidad}gr of ${ingrediente.ingrediente}`
      );
    });

    const newReceta = {
      title: this.recetaForm.value.recetaNombre,
      ingr,
    };

    this.recetasService.analizeReceta(newReceta).subscribe((response) => {
      this.analisys = response;
    });
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

  getBackground(): string {
    const bg = this.recetaForm.get('recetaImagen').value;

    if (bg === '') {
      return '../../assets/img/receta.jpg';
    }

    return bg;
  }

  ngOnDestroy(): void {

  }

  get ingredientes(): FormArray {
    return this.recetaForm.get('ingredientes') as FormArray;
  }

  onPrePopulateRecipe(): void {
    const ingredients = [
      { ingrediente: 'Chicken', ingredienteCantidad: 200 },
      { ingrediente: 'Potatoes', ingredienteCantidad: 500 },
      { ingrediente: 'Garlic', ingredienteCantidad: 20 },
      { ingrediente: 'Olive Oil', ingredienteCantidad: 35 },
      { ingrediente: 'Lemon juice', ingredienteCantidad: 60 },
      { ingrediente: 'Mushrooms', ingredienteCantidad: 200 },
    ];

    ingredients.map((ingr) => {
      this.ingredientes.push(
        this.fb.group({
          ingrediente: [ingr.ingrediente],
          ingredienteCantidad: [ingr.ingredienteCantidad],
        })
      );
    });

    this.recetaForm.patchValue({
      recetaNombre: 'Chicken with potatoes',
      recetaImagen:
        'https://www.eatwell101.com/wp-content/uploads/2018/05/Garlic-Butter-Chicken-and-Potatoes-Skillet.jpg',
    });

    this.ingredientes.removeAt(0);
  }
}
