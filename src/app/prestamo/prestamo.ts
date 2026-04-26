import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { Prestamo } from './model/Prestamo';
import { PrestamoPage } from "./model/PrestamoPage";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class PrestamoService {
    constructor(private http: HttpClient) {}

    private baseUrl = 'http://localhost:8080/prestamo';

    getPrestamos(pageable: Pageable): Observable<PrestamoPage> {
        return this.http.post<PrestamoPage>(this.baseUrl, { pageable: pageable });
    }

    savePrestamo(prestamo: Prestamo): Observable<Prestamo> {
        const { id } = prestamo;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
        return this.http.put<Prestamo>(url, prestamo);
    }

    deletePrestamo(idPrestamo: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${idPrestamo}`);
    }

    getAllPrestamos(): Observable<Prestamo[]> {
        return this.http.get<Prestamo[]>(this.baseUrl);
    }
}
