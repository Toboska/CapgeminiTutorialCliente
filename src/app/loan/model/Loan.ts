import { Client } from "../../client/model/Client";
import { Game } from "../../game/model/Game";

export class Loan{
    id: number;
    loanStartDate: string | Date | null = null;
    loanEndDate: string | Date | null = null;
    game: Game;
    client: Client;
}