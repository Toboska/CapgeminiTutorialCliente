import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from './model/Prestamo';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
    constructor(
        private http: HttpClient
    ) {}

    private baseUrl = 'http://localhost:8080/prestamo';

    getPrestamos(title?: string, categoryId?: number): Observable<Prestamo[]> {
        return this.http.get<Prestamo[]>(this.composeFindUrl(title, categoryId));
    }

    savePrestamo(prestamo: Prestamo): Observable<void> {
        const { id } = prestamo;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;

        return this.http.put<void>(url, prestamo);
    }

    private composeFindUrl(title?: string, categoryId?: number): string {
        const params = new URLSearchParams();
        if (title) {
          params.set('title', title);
        }  
        if (categoryId) {
            params.set('idCategory', categoryId.toString());
        }
        const queryString = params.toString();
        return queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    }
}