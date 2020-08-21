import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RecetasService } from '../shared/recetas.service';
import { Menu, MenuService } from '../shared/menu.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.scss'],
})
export class RecetasComponent implements OnInit, OnDestroy {
  recetaForm: FormGroup = this.fb.group({
    recetaNombre: ['', Validators.required],
    recetaImagen: [''],
    menu: ['', Validators.required],
    plato: ['', Validators.required],
    ingredientes: this.fb.array([
      this.fb.group({
        ingrediente: [''],
        ingredienteCantidad: [''],
      }),
    ]),
  });

  analisys;
  formSub: Subscription;
  menusUsuarioSub: Subscription;
  selectedMenuId: string;
  comida: string;
  menusUsuario: [Menu];

  constructor(
    private fb: FormBuilder,
    private recetasService: RecetasService,
    private menuService: MenuService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.menusUsuarioSub = this.menuService.userMenus.subscribe(
      (menus: [Menu]) => {
        this.menusUsuario = menus;
      }
    );

    this.selectedMenuId = this.router.snapshot.queryParamMap.get('menuId');
    console.log(this.selectedMenuId);
    this.comida = this.router.snapshot.queryParamMap.get('comida');
  }

  onSubmit(): void {
    const recetaAnalizada = {
      ...this.recetaForm.value,
      analisisNutricional: { ...this.analisys },
    };

    console.log(recetaAnalizada);

    /*this.recetaSub = this.recetasService
      .saveReceta(recetaAnalizada)
      .subscribe((receta) => {
        console.log(receta);
      });*/
  }

  onAnalize(): void {
    const ingr = [];
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
    this.menusUsuarioSub.unsubscribe();
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
