import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pageable } from '../app/core/model/page/Pageable';
import { Author } from './model/Author';
import { AuthorPage } from './model/AuthorPage';
import { AUTHOR_DATA } from './mock-authors';

@Injectable({
    providedIn: 'root',
})
export class AuthorService {
    constructor() {}

    getAuthors(pageable: Pageable): Observable<AuthorPage> {
        return of(AUTHOR_DATA);
    }

    saveAuthor(author: Author): Observable<void> {
        return of(null);
    }

    deleteAuthor(idAuthor: number): Observable<void> {
        return of(null);
    }
}
