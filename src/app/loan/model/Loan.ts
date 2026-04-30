import { Client } from "../../client/model/Client";
import { Game } from "../../game/model/Game";

export class Loan{
    id: number;
    loanStartDate: Date;
    loanEndDate: Date;
    game: Game;
    client: Client;
}