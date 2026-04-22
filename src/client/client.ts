import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from './model/Client';
//Clase que nos permite trabajar con datos asíncronos, datos que pueden tardar en llegar o cambiar con el tiempo
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl = 'http://localhost:8080/client';

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  saveClient(client: Client): Observable<Client> {
    const { id } = client;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this.http.put<Client>(url, Client);
  }

  deleteClient(idClient : number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idClient}`);
  }  
}
