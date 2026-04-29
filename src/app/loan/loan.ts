import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Pageable } from '../core/model/page/Pageable';
import { Loan } from './model/Loan';
import { LoanPage } from './model/LoanPage';

@Injectable({
  providedIn: 'root',
})
export class LoanService {

  private baseUrl = 'http://localhost:8080/loan';

  constructor(private http: HttpClient) {}

  getLoans(
    pageable: Pageable,
    gameId?: number | null,
    clientId?: number | null,
    date?: Date | null
  ): Observable<LoanPage> {

    let params = new HttpParams()
      .set('page', pageable.pageNumber.toString())
      .set('size', pageable.pageSize.toString());

    if (date != null) {
      params = params.set('date', this.toLocalDateString(date));
    }

    return this.http.get<LoanPage>(
      this.composeFindUrlLoan(gameId, clientId),
      { params }
    );
  }

  saveLoan(loan: Loan): Observable<Loan> {
    const url = loan.id
      ? `${this.baseUrl}/${loan.id}`
      : this.baseUrl;

    return this.http.put<Loan>(url, loan);
  }

  deleteLoan(idLoan: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idLoan}`);
  }

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.baseUrl);
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
  private composeFindUrlLoan(
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