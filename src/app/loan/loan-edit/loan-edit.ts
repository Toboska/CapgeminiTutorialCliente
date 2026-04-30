import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { LoanService } from '../loan';
import { Loan } from '../model/Loan';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, NativeDateAdapter } from '@angular/material/core';

// Modelos
import { Client } from '../../client/model/Client';
import { Game } from '../../game/model/Game';

// Servicios
import { ClientService } from '../../client/client';
import { GameService } from '../../game/game';

@Component({
  selector: 'app-loan-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
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
  templateUrl: './loan-edit.html',
  styleUrl: './loan-edit.scss',
})
export class LoanEdit implements OnInit {

  submitted: boolean = false; // ✅ inicializado correctamente
  loan: Loan = new Loan();
  clients: Client[] = [];
  games: Game[] = [];

  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<LoanEdit>,
    @Inject(MAT_DIALOG_DATA) public data: { loan: Loan },
    private loanService: LoanService,
    private clientService: ClientService,
    private gameService: GameService,
    private cdr: ChangeDetectorRef // ✅ añadido
  ) {}

  ngOnInit(): void {

    if (this.data.loan != null) {
      this.loan = Object.assign(new Loan(), this.data.loan);

      if (this.loan.loanStartDate) {
        this.loan.loanStartDate = new Date(this.loan.loanStartDate);
      }
      if (this.loan.loanEndDate) {
        this.loan.loanEndDate = new Date(this.loan.loanEndDate);
      }
    }

    this.clientService.getClients().subscribe((clients) => {
      this.clients = clients;

      if (this.loan.client != null) {
        const clientFilter = clients.filter(c => c.id === this.loan.client.id);
        if (clientFilter.length > 0) {
          this.loan.client = clientFilter[0];
        }
      }
    });

    this.gameService.getGames().subscribe((games) => {
      this.games = games;

      if (this.loan.game != null) {
        const gameFilter = games.filter(g => g.id === this.loan.game.id);
        if (gameFilter.length > 0) {
          this.loan.game = gameFilter[0];
        }
      }
    });
  }

  // ✅ Guardado con detección de cambios forzada
  onSave() {
    this.submitted = true;
    this.errorMessage = '';

    this.loanService.saveLoan(this.loan).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error al guardar:', err);

        if (err?.error?.message) {
          this.errorMessage = err.error.message;
        } else if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Error al guardar el préstamo';
        }

        // ✅ FORZAR refresco inmediato de la UI
        this.cdr.detectChanges();
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onLoanStartDate(date: Date | null) {
      if (date) {
        this.loan.loanStartDate = this.toLocalDateString(date);
      }
    }

  onLoanEndDate(date: Date | null) {
    if (date) {
      this.loan.loanEndDate = this.toLocalDateString(date);
    }
  }

  private toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}