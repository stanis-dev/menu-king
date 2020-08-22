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
  saveRecetaSub: Subscription;
  getRecetaSub: Subscription;
  formSub: Subscription;
  menusUsuarioSub: Subscription;
  recetoForEdit;
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
        if (!menus) {
          console.log('no menus, requesting');
          return this.menuService.getMenus();
        }

        this.menusUsuario = menus;

        this.selectedMenuId =
          this.router.snapshot.queryParamMap.get('menuId') ||
          this.menusUsuario[0]._id;
      }
    );

    this.comida =
      this.router.snapshot.queryParamMap.get('comida') || 'entrante';

    if (this.router.snapshot.children[0].params.recetaId) {
      const recetaId = this.router.snapshot.children[0].params.recetaId;
      this.getRecetaSub = this.recetasService
        .getRecetaById(recetaId)
        .subscribe((receta) => {
          this.recetoForEdit = receta.data;
          this.prepopulateForm();
        });
    }
  }

  onSubmit(): void {
    const recetaAnalizada = {
      ...this.recetaForm.value,
      analisisNutricional: { ...this.analisys },
    };

    console.log(recetaAnalizada);

    this.saveRecetaSub = this.recetasService
      .saveReceta(recetaAnalizada)
      .subscribe((receta) => {
        console.log(receta);
      });
  }

  prepopulateForm(): void {
    this.analisys = this.recetoForEdit.analisisNutricional;

    this.recetaForm.patchValue({
      recetaNombre: this.recetoForEdit.recetaNombre,
      recetaImagen: this.recetoForEdit.recetaImagen,
    });

    this.recetoForEdit.ingredientes.map((ingrediente) => {
      this.ingredientes.push(
        this.fb.group({
          ingrediente: ingrediente.ingrediente,
          ingredienteCantidad: ingrediente.ingredienteCantidad,
        })
      );
    });
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

  onUpdateReceta(): void {
    this.recetasService.updateReceta(
      this.recetaForm.value,
      this.recetoForEdit._id
    );
  }

  ngOnDestroy(): void {
    this.menusUsuarioSub.unsubscribe();

    if (this.saveRecetaSub) {
      this.saveRecetaSub.unsubscribe();
    }

    if (this.getRecetaSub) {
      this.getRecetaSub.unsubscribe();
    }
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
