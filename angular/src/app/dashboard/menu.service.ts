import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Menu {
  analisisNutricional: {
    etiquetasSalud: [string];
    alergias: [string];
    Kcal: number;
    prot: number;
    avisos: [string];
    azucares: number;
    carbs: number;
    grasas: number;
    saturadas: number;
  };
  cantidadRecetas: number;
  menuName: string;
  pax: number;
  user: string;
  _v: number;
  _id: string;
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(private http: HttpClient) {}

  saveMenu(menu): Observable<any> {
    return this.http.post('./api/v1/menu', menu);
  }

  getMenus(): Observable<any> {
    return this.http.get('/api/v1/menu');
  }
}
