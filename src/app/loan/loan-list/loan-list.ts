import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoanEdit } from '../loan-edit/loan-edit';
import { LoanService } from '../loan';
import { Loan } from '../model/Loan';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoanPage } from '../model/LoanPage';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, NativeDateAdapter } from '@angular/material/core';
//Para poder mostrar los clientes:
import { Client } from '../../client/model/Client';
import { ClientService } from '../../client/client';

//Para poder mostrar los Juegos:
import { Game } from '../../game/model/Game';
import { GameService } from '../../game/game';

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
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;
  //Clientes
  clients: Client [];
  filterClient: Client;
  //Juegos
  games: Game[];
  filterGame: Game;
  //Fecha
  filterDate: Date;

  dataSource = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['id', 'game','client','loanStartDate', 'loanEndDate', 'action'];

  constructor(
    private loanService: LoanService,
    private clientService: ClientService,
    private gameService: GameService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.clientService
      .getClients()
      .subscribe((clients) => {
          this.clients = clients;
      });

    this.gameService
      .getGames()
      .subscribe((games) => {
          this.games = games;
      });

    this.loadPage();
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

    const dto = {
      pageable: pageable,
      clientId: this.filterClient ? this.filterClient.id : null,
      gameId: this.filterGame ? this.filterGame.id : null, 
      dateSelected: this.filterDate
        ? this.formatDate(this.filterDate)
        : null
    };

    this.loanService.getLoans(dto).subscribe((data) => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }


  createLoan() {
    const dialogRef = this.dialog.open(LoanEdit, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  editLoan(loan: Loan) {
    const dialogRef = this.dialog.open(LoanEdit, {
      data: { loan: loan },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  deleteLoan(loan: Loan) {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        title: 'Eliminar préstamo',
        description:
          'Atención si borra el préstamo se perderán sus datos.<br> ¿Desea eliminar el préstamo?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loanService.deleteLoan(loan.id).subscribe((result) => {
          this.ngOnInit();
        });
      }
    });
  }

    onSearch(): void {
    this.pageNumber = 0;
    this.loadPage();
  }

  onCleanFilter(): void {
    this.filterGame = null;
    this.filterClient = null;
    this.filterDate = null;
    this.pageNumber = 0; // Resetear página al limpiar
    this.loadPage();
  }

}