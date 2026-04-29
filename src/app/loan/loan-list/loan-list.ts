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
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, NativeDateAdapter } from '@angular/material/core';

import { LoanEdit } from '../loan-edit/loan-edit';
import { LoanService } from '../loan';
import { Loan } from '../model/Loan';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';

import { Game } from '../../game/model/Game';
import { Client } from '../../client/model/Client';
import { GameService } from '../../game/game';
import { ClientService } from '../../client/client';

@Component({
  selector: 'app-loan-list',
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
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: NativeDateAdapter }
  ],
  templateUrl: './loan-list.html',
  styleUrl: './loan-list.scss',
})
export class LoanList implements OnInit {

  games: Game[] = [];
  clients: Client[] = [];

  // Filtros
  filterGame: Game | null = null;
  filterClient: Client | null = null;
  filterDate: Date | null = null;

  // Paginación
  pageNumber = 0;
  pageSize = 5;
  totalElements = 0;

  dataSource = new MatTableDataSource<Loan>();
  displayedColumns: string[] = [
    'id',
    'gameTitle',
    'clientName',
    'loanStartDate',
    'loanEndDate',
    'action'
  ];

  constructor(
    private loanService: LoanService,
    private dialog: MatDialog,
    private clientService: ClientService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    // Carga inicial de maestros para los selectores
    this.clientService.getClients().subscribe(clients => this.clients = clients);
    this.gameService.getGames().subscribe(games => this.games = games);

    this.loadPage();
  }

  onCleanFilter(): void {
    this.filterGame = null;
    this.filterClient = null;
    this.filterDate = null;
    this.pageNumber = 0; // Resetear página al limpiar
    this.loadPage();
  }

  onSearch(): void {
    this.pageNumber = 0; // Siempre volver a la primera página al buscar
    this.loadPage();
  }

  loadPage(event?: PageEvent): void {
    const pageable: Pageable = {
      pageNumber: event?.pageIndex ?? this.pageNumber,
      pageSize: event?.pageSize ?? this.pageSize,
      sort: [{ property: 'id', direction: 'ASC' }]
    };

    const gameId = this.filterGame?.id ?? null;
    const clientId = this.filterClient?.id ?? null;
    const date = this.filterDate ?? null;

    this.loanService.getLoans(pageable, gameId, clientId, date).subscribe(data => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }

  createLoan(): void {
    const dialogRef = this.dialog.open(LoanEdit, { 
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadPage(); // Solo recarga si hubo cambios
    });
  }

  editLoan(loan: Loan): void {
    const dialogRef = this.dialog.open(LoanEdit, {
      data: { loan: loan }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Usamos loadPage para mantener los filtros y página actual
      this.loadPage();
    });
  }

  deleteLoan(loan: Loan): void {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        title: 'Eliminar préstamo',
        description: 'Atención: si borra el préstamo se perderán sus datos.<br>¿Desea eliminar el préstamo?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loanService.deleteLoan(loan.id!).subscribe(() => {
          this.loadPage();
        });
      }
    });
  }
}