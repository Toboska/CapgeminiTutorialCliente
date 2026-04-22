import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from '../model/Client';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../client';
import { MatDialog } from '@angular/material/dialog';
import { ClientEdit } from '../client-edit/client-edit';
import { DialogConfirmation } from '../../app/core/dialog-confirmation/dialog-confirmation';

//El .ts se encarga de definit la lógica, comportamiento, y se conecta con su html y estilos(scss)

@Component({
  selector: 'app-client-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})

//OnInit interfaz de angular para cargar datos, llamar a servicios y inicializar variables
export class ClientList implements OnInit{ 
  
  //MatTableDataSource clase de Angular que permite gestionar los datos de una tabla y facilita paginación...
  dataSource = new MatTableDataSource<Client>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(
    private clientService = ClientService,
    public dialog: MatDialog,
  ){}

  ngOnInit(): void {
    
  }


}
