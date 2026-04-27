import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PrestamoEdit } from '../prestamo-edit/prestamo-edit';
import { PrestamoService } from '../prestamo';
import { Prestamo } from '../model/Prestamo';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
//Para poder mostrar los datos en los desplegables
import { Game } from "../../game/model/Game";
import { Client } from "../../client/model/Client";
//Para poder acceder a las instancias de las clases
import { GameService } from '../../game/game';
import { ClientService } from '../../client/client';

@Component({
  selector: 'app-prestamo-list',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatIconModule, 
    MatTableModule, 
    CommonModule, 
    MatSelectModule,
    MatPaginatorModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './prestamo-list.html',
  styleUrl: './prestamo-list.scss',
})
export class PrestamoList implements OnInit {
  games: Game[];
  clients: Client[];
  filterGame: Game;
  filterClient: Client;
  filterDate: Date;

  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Prestamo>();
  displayedColumns: string[] = ['id', 'gameTitle', 'clientName', 'fechaPrestamo', 'fechaDevolucion','action'];

  constructor(
    private prestamoService: PrestamoService,
    public dialog: MatDialog,
    private clientService: ClientService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    //Cargamos los clientes
    this.clientService
      .getClients()
      .subscribe((clients) => {
          this.clients = clients;
      });

    //Cargamos los juegos
    this.gameService
      .getGames()
      .subscribe((games) => {
          this.games = games;
      });

    this.loadPage();
  }

  onCleanFilter(): void {
      this.filterGame = null;
      this.filterClient = null;
      this.filterDate = null;
  }

  onSearch(): void {
    const pageable: Pageable = {
        pageNumber: 0,
        pageSize: this.pageSize,
        sort: [{ property: 'id', direction: 'ASC' }]
    };

    const gameId = this.filterGame ? this.filterGame.id : null;
    const clientId = this.filterClient ? this.filterClient.id : null;
    const date = this.filterDate;

    this.prestamoService.getPrestamos(pageable, gameId, clientId, date).subscribe((data) => {
        this.dataSource.data = data.content;
        this.totalElements = data.totalElements;
        this.pageNumber = data.pageable.pageNumber;
    });
}

  loadPage(event?: PageEvent) {
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: [
        {
          property: 'id',
          direction: 'ASC',
        },
      ],
    };

    if (event != null) {
      pageable.pageSize = event.pageSize;
      pageable.pageNumber = event.pageIndex;
    }

    this.prestamoService.getPrestamos(pageable).subscribe((data) => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }

  createPrestamo() {
    const dialogRef = this.dialog.open(PrestamoEdit, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  editPrestamo(prestamo: Prestamo) {
    const dialogRef = this.dialog.open(PrestamoEdit, {
      data: { prestamo: prestamo },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  deletePrestamo(prestamo: Prestamo) {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        title: 'Eliminar prestamo',
        description:
          'Atención si borra el préstamos se perderán sus datos.<br> ¿Desea eliminar el préstamo?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.prestamoService.deletePrestamo(prestamo.id).subscribe((result) => {
          this.ngOnInit();
        });
      }
    });
  }
}