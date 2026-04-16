import { Injectable } from '@angular/core';
import { CATEGORY_DATA } from './model/mock-categories';
import { Category } from './model/category';
//Clase que nos permite trabajar con datos asíncronos, datos que pueden tardar en llegar o cambiar con el tiempo
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor() { }

  getCategories(): Observable<Category[]> {
    return of(CATEGORY_DATA);
  }

  saveCategory(category: Category): Observable<Category> {
    return of(null);
  }

  deleteCategory(idCategory : number): Observable<any> {
    return of(null);
  }  
}
