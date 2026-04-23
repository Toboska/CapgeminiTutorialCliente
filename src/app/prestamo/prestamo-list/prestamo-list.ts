import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrestamoEdit } from '../prestamo-edit/prestamo-edit';
import { PrestamoService } from '../prestamo';
import { Prestamo } from '../model/Prestamo';
import { CategoryService } from '../../category/category';
import { Category } from '../../category/model/category';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
/*Al entrar a la página no se mostraba nada, por lo que he añadido esta biblioteca,
que se encarga de detectar entre otros llegada de datos por HTTP*/
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-prestamo-list',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
    templateUrl: './prestamo-list.html',
    styleUrl: './prestamo-list.scss',
})
export class PrestamoList implements OnInit {
    categories: Category[] = [];
    prestamos: Prestamo[] = [];
    filterCategory: Category;
    filterTitle: string | null = null;

    constructor(
        private prestamoService: PrestamoService,
        private categoryService: CategoryService,
        public dialog: MatDialog,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.categoryService
            .getCategories()
            .subscribe((categories) => {
                this.categories = categories;
                this.cd.detectChanges(); //En cuanto haya cambios actualiza el HTML
            });

        this.onSearch();
    }

    onCleanFilter(): void {
        this.filterTitle = null;
        this.filterCategory = null;
        this.onSearch();
    }

    onSearch(): void {
        const title = this.filterTitle;
        const categoryId =
            this.filterCategory != null ? this.filterCategory.id : null;

        this.prestamoService
            .getPrestamos(title, categoryId)
            .subscribe((prestamos) => {
                this.prestamos = prestamos
                this.cd.detectChanges();
            });
    }

    createPrestamo() {
        const dialogRef = this.dialog.open(PrestamoEdit, {
            data: {},
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.ngOnInit();
        });
    }

    editPrestamo(prestamo: Prestamo) {
        const dialogRef = this.dialog.open(PrestamoEdit, {
            data: { prestamo: prestamo },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.onSearch();
        });
    }
}