import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecetasService {
  recetasMenu: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) {}

  // TODO modelo receta
  analizeReceta(receta): Observable<any> {
    return this.http
      .post(
        'https://api.edamam.com/api/nutrition-details?app_id=29beb672&app_key=ef4964969c8e6289f6259984b9531070',
        receta
      )
      .pipe(
        map((respuestaRecetas: any) => {
          console.log(respuestaRecetas);
          const analisis = {
            caloriasTotal: respuestaRecetas.calories,
            raciones: +respuestaRecetas.yield,
            caloriasRacion: Math.round(
              respuestaRecetas.calories / respuestaRecetas.yield
            ),
            prot: Math.round(respuestaRecetas.totalNutrients.PROCNT.quantity),
            carbs: Math.round(respuestaRecetas.totalNutrients.CHOCDF.quantity),
            azucares: Math.round(
              respuestaRecetas.totalNutrients.SUGAR.quantity
            ),
            grasas: Math.round(respuestaRecetas.totalNutrients.FAT.quantity),
            saturadas: Math.round(
              respuestaRecetas.totalNutrients.FASAT.quantity
            ),
            etiquetas: [],
            avisos: respuestaRecetas.cautions,
            alergenos: [],
          };

          respuestaRecetas.healthLabels.map((label) => {
            switch (label) {
              case 'DAIRY_FREE':
                analisis.alergenos.push('no contiene lácteos');
                break;
              case 'BALANCED':
                analisis.etiquetas.push('equilibrada');
                break;
              case 'LOW_FAT':
                analisis.etiquetas.push('baja en grasas');
                break;
              case 'LOW_CARB':
                analisis.etiquetas.push('bajo en carbohidratos');
                break;
              case 'VEGAN':
                analisis.etiquetas.push('apto para veganos');
                break;
              case 'HIGH_PROTEIN':
                analisis.etiquetas.push('alto contenido en proteínas');
                break;
              case 'SUGAR_CONSCIOUS':
                analisis.etiquetas.push('bajo en azucares');
                break;
              case 'PEANUT_FREE':
                analisis.alergenos.push('no contiene cacahuetes');
                break;
              case 'TREE_NUT_FREE':
                analisis.alergenos.push('no contiene frutos secos');
                break;
              case 'ALCOHOL_FREE':
                analisis.alergenos.push('no contiene alcoholes');
                break;
              default:
                return;
            }
          });

          respuestaRecetas.dietLabels.map((label) => {
            switch (label) {
              case 'DAIRY_FREE':
                analisis.alergenos.push('no contiene lácteos');
                break;
              case 'BALANCED':
                analisis.etiquetas.push('equilibrada');
                break;
              case 'LOW_FAT':
                analisis.etiquetas.push('baja en grasas');
                break;
              case 'LOW_CARB':
                analisis.etiquetas.push('bajo en carbohidratos');
                break;
              case 'VEGAN':
                analisis.etiquetas.push('apto para veganos');
                break;
              case 'HIGH_PROTEIN':
                analisis.etiquetas.push('alto contenido en proteínas');
                break;
              case 'SUGAR_CONSCIOUS':
                analisis.etiquetas.push('bajo en azucares');
                break;
              case 'PEANUT_FREE':
                analisis.alergenos.push('no contiene cacahuetes');
                break;
              case 'TREE_NUT_FREE':
                analisis.alergenos.push('no contiene frutos secos');
                break;
              case 'ALCOHOL_FREE':
                analisis.alergenos.push('no contiene alcoholes');
                break;
              default:
                return;
            }
          });
          return analisis;
        })
      );
  }

  saveReceta(receta): Observable<object> {
    return this.http.post('/api/v1/receta', receta).pipe(
      map((recetaResponse) => {
        console.log(recetaResponse);
        return recetaResponse;
      })
    );
  }

  getRecetas(): Observable<any> {
    return this.http.get<any>('/api/v1/receta').pipe(
      map((recetasResponse) => {
        return recetasResponse;
      })
    );
  }

  getMenuRecetas(menuId): void {
    this.http
      .get(`/api/v1/menu/${menuId}/recetas`)
      .pipe(
        tap<any>((response) => {
          const recetasOrganizado = {
            entrante: [],
            principal: [],
            postre: [],
          };

          response.data.map((receta) => {
            recetasOrganizado[receta.comida].push(receta);
          });

          this.recetasMenu.next(recetasOrganizado);
        })
      )
      .subscribe();
  }
}
