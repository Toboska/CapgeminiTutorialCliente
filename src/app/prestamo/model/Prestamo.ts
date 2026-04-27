import { Game } from "../../game/model/Game";
import { Client } from "../../client/model/Client";

export class Prestamo {
  id: number | null = null;
  fechaPrestamo: string;   
  fechaDevolucion: string;
  game: Game | null = null;
  client: Client | null = null;
  loanDatePickerValue: Date | null = null;
  returnDatePickerValue: Date | null = null;
}