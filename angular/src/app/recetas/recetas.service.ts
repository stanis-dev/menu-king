import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecetasService {
  recetasUsuario: [];

  constructor(private httpClient: HttpClient) {}

  // TODO modelo receta
  analizeReceta(receta) {
    return this.httpClient
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
            prot: Math.round(
              respuestaRecetas.totalNutrients.PROCNT.quantity /
                respuestaRecetas.yield
            ),
            carbs: Math.round(
              respuestaRecetas.totalNutrients.CHOCDF.quantity /
                respuestaRecetas.yield
            ),
            azucares: Math.round(
              respuestaRecetas.totalNutrients.SUGAR.quantity /
                respuestaRecetas.yield
            ),
            grasas: Math.round(
              respuestaRecetas.totalNutrients.FAT.quantity /
                respuestaRecetas.yield
            ),
            saturadas: Math.round(
              respuestaRecetas.totalNutrients.FASAT.quantity /
                respuestaRecetas.yield
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
          console.log(analisis);
          return analisis;
        })
      );
  }

  saveReceta(receta): Observable<object> {
    return this.httpClient.post('/api/v1/receta', receta).pipe(
      map((recetaResponse) => {
        console.log(recetaResponse);
        return recetaResponse;
      })
    );
  }

  getRecetas(): Observable<any> {
    return this.httpClient.get<any>('/api/v1/receta').pipe(
      map((recetasResponse) => {
        this.recetasUsuario = recetasResponse.data;
        return recetasResponse;
      })
    );
  }
}
