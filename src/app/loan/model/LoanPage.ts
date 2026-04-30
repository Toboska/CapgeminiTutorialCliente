import { Pageable } from '../../core/model/page/Pageable';
import { Loan } from "./Loan";

export class LoanPage {
    content: Loan[];
    clientId?: number;
    gameId?: number;
    dateSelected?: Date;
    pageable: Pageable;
    totalElements: number;
}