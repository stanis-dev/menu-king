import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
  userMenus: BehaviorSubject<[Menu]> = new BehaviorSubject<[Menu]>(null);
  menuToEdit: BehaviorSubject<Menu> = new BehaviorSubject<Menu>(null);
  menuSelected: BehaviorSubject<Menu> = new BehaviorSubject<Menu>(undefined);

  constructor(private http: HttpClient) {}

  saveMenu(menu): void {
    this.http
      .post('./api/v1/menu', menu)
      .pipe(
        map<any, any>((response) => {
          return response.data;
        }),
        tap((menu) => {
          this.getMenus();
        })
      )
      .subscribe();
  }

  getMenus(): void {
    this.http
      .get('/api/v1/menu')
      .pipe(
        tap<any>((response) => {
          this.userMenus.next(response.data);
        })
      )
      .subscribe();
  }

  patchMenu(menuId: string, patchValues: any): Observable<any> {
    return this.http.patch(`/api/v1/menu/${menuId}`, patchValues);
  }

  deleteMenu(menuId: string): void {
    this.http
      .delete(`/api/v1/menu/${menuId}`)
      .pipe(
        tap(() => {
          this.getMenus();
        })
      )
      .subscribe();
  }
}
