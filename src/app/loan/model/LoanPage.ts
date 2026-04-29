import { Pageable } from '../../core/model/page/Pageable';
import { Loan } from "../model/Loan";

export class LoanPage{
    content: Loan[];
    pageable: Pageable;
    totalElements: number;
}