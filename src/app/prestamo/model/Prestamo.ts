import { Game } from "../../game/model/Game";
import { Client } from "../../client/model/Client";

export class Prestamo{
    id: number;
    fechaPrestamo: Date;
    fechaDevolucion: Date;
    game: Game;
    client: Client;
}