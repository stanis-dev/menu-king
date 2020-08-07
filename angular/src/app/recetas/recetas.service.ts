import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecetasService {
  recetasUsuario: [];

  constructor(private httpClient: HttpClient) {}

  // TODO modelo receta
  fetchReceta(receta) {
    return this.httpClient
      .post(
        'https://api.edamam.com/api/nutrition-details?app_id=29beb672&app_key=ef4964969c8e6289f6259984b9531070',
        receta
      )
      .pipe(
        map((respuestaRecetas: any) => {
          console.log(respuestaRecetas);
          const analisis = {
            totalCalories: respuestaRecetas.calories,
            raciones: +respuestaRecetas.yield,
            calRacion: Math.round(
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
              case 'HIGH_PROTEIN':
                analisis.etiquetas.push('alto contenido en proteínas');
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
              case 'TREE_NUT_FREE':
                analisis.alergenos.push('no contiene alcohol');
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
              case 'HIGH_PROTEIN':
                analisis.etiquetas.push('alto contenido en proteínas');
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
              case 'TREE_NUT_FREE':
                analisis.alergenos.push('no contiene alcohol');
                break;
              default:
                return;
            }
          });

          return analisis;
        })
      );
  }
}