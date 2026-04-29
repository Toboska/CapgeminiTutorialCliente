import { Component, OnInit, Inject } from '@angular/core';
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
  // Inicializamos para evitar errores de "undefined" en el HTML
  loan: Loan = new Loan();
  clients: Client[] = [];
  games: Game[] = [];

  constructor(
    public dialogRef: MatDialogRef<LoanEdit>,
    @Inject(MAT_DIALOG_DATA) public data: { loan: Loan },
    private loanService: LoanService,
    private clientService: ClientService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    // 1. Clonar el objeto o crear uno nuevo
    if (this.data.loan != null) {
      this.loan = Object.assign(new Loan(), this.data.loan);

      // 2. IMPORTANTE: El Datepicker de Material solo funciona con objetos Date.
      // Si los datos vienen del backend como String, hay que transformarlos.
      if (this.loan.loanStartDate) {
        this.loan.loanStartDate = new Date(this.loan.loanStartDate);
      }
      if (this.loan.loanEndDate) {
        this.loan.loanEndDate = new Date(this.loan.loanEndDate);
      }
    }

    // 3. Cargar listado de clientes
    this.clientService.getClients().subscribe((clients) => {
      this.clients = clients;

      if (this.loan.client != null) {
        const clientFilter = clients.filter(c => c.id === this.loan.client.id);
        if (clientFilter.length > 0) {
          this.loan.client = clientFilter[0];
        }
      }
    });

    // 4. Cargar listado de juegos
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

  onSave() {
    if (!this.validateRange()) {
      // Aquí podrías mostrar un aviso visual si la validación falla
      return;
    }

    this.loanService.saveLoan(this.loan).subscribe(() => {
      this.dialogRef.close();
    });
  }

  validateRange(): boolean {
    if (this.loan.loanStartDate && this.loan.loanEndDate) {
      const start = new Date(this.loan.loanStartDate);
      const end = new Date(this.loan.loanEndDate);

      const diffInMs = end.getTime() - start.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      // Regla: No negativo y máximo 14 días
      return diffInDays >= 0 && diffInDays <= 14;
    }
    return false;
  }

  onClose() {
    this.dialogRef.close();
  }
}