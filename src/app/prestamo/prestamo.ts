import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Pageable } from '../core/model/page/Pageable';
import { Prestamo } from './model/Prestamo';
import { PrestamoPage } from './model/PrestamoPage';

@Injectable({
  providedIn: 'root',
})
export class PrestamoService {

  private baseUrl = 'http://localhost:8080/prestamo';

  constructor(private http: HttpClient) {}

  getPrestamos(
    pageable: Pageable,
    gameId?: number | null,
    clientId?: number | null,
    date?: Date | null
  ): Observable<PrestamoPage> {

    let params = new HttpParams()
      .set('page', pageable.pageNumber.toString())
      .set('size', pageable.pageSize.toString());

    if (date != null) {
      params = params.set('date', this.toLocalDateString(date));
    }

    return this.http.get<PrestamoPage>(
      this.composeFindUrlPrestamo(gameId, clientId),
      { params }
    );
  }

  savePrestamo(prestamo: Prestamo): Observable<Prestamo> {
    const url = prestamo.id
      ? `${this.baseUrl}/${prestamo.id}`
      : this.baseUrl;

    return this.http.put<Prestamo>(url, prestamo);
  }

  deletePrestamo(idPrestamo: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idPrestamo}`);
  }

  getAllPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.baseUrl);
  }

  // ------------------------
  // MÉTODOS PRIVADOS
  // ------------------------

  /**
   * Convierte Date de JS a string local yyyy-MM-dd
   * (SIN UTC, SIN timezone, SIN desfases)
   */
  private toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Construye la URL SOLO con IDs simples
   * NUNCA meter fechas aquí
   */
  private composeFindUrlPrestamo(
    gameId?: number | null,
    clientId?: number | null
  ): string {

    const params: string[] = [];

    if (gameId != null) {
      params.push(`gameId=${gameId}`);
    }

    if (clientId != null) {
      params.push(`clientId=${clientId}`);
    }

    return params.length > 0
      ? `${this.baseUrl}?${params.join('&')}`
      : this.baseUrl;
  }
}