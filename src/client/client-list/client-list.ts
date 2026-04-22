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
import { CategoryEdit } from '../../category/category-edit/category-edit';

//El .ts se encarga de definit la lógica, comportamiento, y se conecta con su html y estilos(scss)

@Component({
  selector: 'app-client-list',
  standalone: true,
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
    private clientService: ClientService,
    public dialog: MatDialog,
  ){}

  //Función que se ejecuta al crear el componente, para cargar datos inciales
  ngOnInit(): void {
    //Llama a un método del servicio, getClients
    //Subribe: Queda pendeinte al servidor, y cuando este contesta ejecuta el contenido de dentro
    this.clientService.getClients().subscribe(
      //Clients, nombre dado a los datos de respuesta del servidor
      //dataSource es la tabla, para mostrar en pantalla
        clients => this.dataSource.data = clients
    );
  }

  createClient(Client: Client){
    //this.dialog.open llama al componente para que lo dibuje por encima
    const dialogRef = this.dialog.open(ClientEdit, {data: {}});
  
    //Como hemos guardado el objeto en dialogRef, podemos monitorizar el estado del edit
    dialogRef.afterClosed().subscribe(result => this.ngOnInit());
  }

  editClient(client: Client){
    //Si le pasamos un cliente, va a saber que estamos editando un cliente existente
    const dialogRef = this.dialog.open(ClientEdit, {data: {client}});
    dialogRef.afterClosed().subscribe(result => this.ngOnInit());
  }

  deleteClient(client: Client) {    
    //Es como en los otros casos pero se crea un elemento (DiálogoConfirmación)
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: { title: "Eliminar cliente", description: "Atención si borra el cliente se perderán sus datos.<br> ¿Desea eliminar el cliente?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //Se llama al servicio para proceder a borrar 
        this.clientService.deleteClient(client.id).subscribe(result => {
          this.ngOnInit();
        }); 
      }
    });
  } 
}
