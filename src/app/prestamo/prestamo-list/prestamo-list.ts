import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { PrestamoEdit } from '../prestamo-edit/prestamo-edit';
import { PrestamoService } from '../prestamo';
import { Prestamo } from '../model/Prestamo';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';

import { Game } from '../../game/model/Game';
import { Client } from '../../client/model/Client';
import { GameService } from '../../game/game';
import { ClientService } from '../../client/client';

@Component({
  selector: 'app-prestamo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './prestamo-list.html',
  styleUrl: './prestamo-list.scss',
})
export class PrestamoList implements OnInit {

  games: Game[] = [];
  clients: Client[] = [];

  filterGame: Game | null = null;
  filterClient: Client | null = null;
  filterDate: Date | null = null;

  pageNumber = 0;
  pageSize = 5;
  totalElements = 0;

  dataSource = new MatTableDataSource<Prestamo>();
  displayedColumns: string[] = [
    'id',
    'gameTitle',
    'clientName',
    'fechaPrestamo',
    'fechaDevolucion',
    'action'
  ];

  constructor(
    private prestamoService: PrestamoService,
    private dialog: MatDialog,
    private clientService: ClientService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
    });

    this.gameService.getGames().subscribe(games => {
      this.games = games;
    });

    this.loadPage();
  }

  onCleanFilter(): void {
    this.filterGame = null;
    this.filterClient = null;
    this.filterDate = null;
    this.loadPage();
  }

  onSearch(): void {
    const pageable: Pageable = {
      pageNumber: 0,
      pageSize: this.pageSize,
      sort: [{ property: 'id', direction: 'ASC' }]
    };

    const gameId = this.filterGame?.id ?? null;
    const clientId = this.filterClient?.id ?? null;
    const date = this.filterDate;
    console.log(date)

    this.prestamoService
      .getPrestamos(pageable, gameId, clientId, date)
      .subscribe(data => {
        this.dataSource.data = data.content;
        this.totalElements = data.totalElements;
        this.pageNumber = data.pageable.pageNumber;
      });
  }

  loadPage(event?: PageEvent): void {
    const pageable: Pageable = {
      pageNumber: event?.pageIndex ?? this.pageNumber,
      pageSize: event?.pageSize ?? this.pageSize,
      sort: [{ property: 'id', direction: 'ASC' }]
    };

    this.prestamoService.getPrestamos(pageable).subscribe(data => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }

  createPrestamo(): void {
    const dialogRef = this.dialog.open(PrestamoEdit, { data: {} });

    dialogRef.afterClosed().subscribe(() => this.ngOnInit());
  }

  editPrestamo(prestamo: Prestamo): void {
    const dialogRef = this.dialog.open(PrestamoEdit, {
      data: { prestamo }
    });

    dialogRef.afterClosed().subscribe(() => this.ngOnInit());
  }

  deletePrestamo(prestamo: Prestamo): void {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        title: 'Eliminar préstamo',
        description:
          'Atención: si borra el préstamo se perderán sus datos.<br>¿Desea eliminar el préstamo?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.prestamoService.deletePrestamo(prestamo.id!).subscribe(() => {
          this.ngOnInit();
        });
      }
    });
  }
}