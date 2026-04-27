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

    getPrestamos(pageable: Pageable, gameId?: number, clientId?: number, date?: Date): Observable<PrestamoPage> {
        
        const url = this.composeFindUrl(gameId, clientId, date);
        
        return this.http.post<PrestamoPage>(url, { pageable: pageable });
    }

    private composeFindUrl(gameId?: number, clientId?: number, date?: Date): string {
        const params = new URLSearchParams();

        if (gameId) {
            params.set('gameId', gameId.toString());
        }
        if (clientId) {
            params.set('clientId', clientId.toString());
        }
        if (date) {
            const formattedDate = date.toISOString().split('T')[0];
            params.set('date', formattedDate);
        }

        const queryString = params.toString();
        return queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
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
