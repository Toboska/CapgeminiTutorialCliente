import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrestamoService } from '../prestamo';
import { Prestamo } from '../model/Prestamo';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
//Clases para poder mostrar los datos correctamente
import { Client } from '../../client/model/Client';
import { Game } from '../../game/model/Game';
//Servicios para poder seleccionar los datos al editar
import { ClientService } from '../../client/client' 
import { GameService } from '../../game/game';


@Component({
  selector: 'app-prestamo-edit',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule ],
  templateUrl: './prestamo-edit.html',
  styleUrl: './prestamo-edit.scss',
})

export class PrestamoEdit implements OnInit {
  prestamo: Prestamo;
  clients: Client[];
  games: Game[];

  constructor(
    public dialogRef: MatDialogRef<PrestamoEdit>,
    @Inject(MAT_DIALOG_DATA) public data: {prestamo: Prestamo},
    private prestamoService: PrestamoService,
    private clientService: ClientService,
    private gameService: GameService

  ){}

  ngOnInit(): void {
  
    this.prestamo = this.data.prestamo ? Object.assign({}, this.data.prestamo) : new Prestamo();

    //Para cuanfo cargue el edit tienen que estar cargados los clientes y juegos

    this.clientService.getClients().subscribe((clients) => {
      this.clients = clients;

      if (this.prestamo.client != null) {
        const clientFilter: Client[] = clients.filter(
          (client) => client.id == this.data.prestamo.client.id
        );
        if (clientFilter != null) {
          this.prestamo.client = clientFilter[0];
        }
      }
    });

    this.gameService.getGames().subscribe((games) => {
      this.games = games;

      if (this.prestamo.game != null) {
        const gameFilter: Game[] = games.filter(
          (game) => game.id == this.data.prestamo.game.id
        );
        if (gameFilter != null) {
          this.prestamo.game = gameFilter[0];
        }
      }
    });

  }

  onSave() {
    this.prestamoService.savePrestamo(this.prestamo).subscribe(() => {
      this.dialogRef.close();
    });
  }
    
  onClose() {
    this.dialogRef.close();
  }
}