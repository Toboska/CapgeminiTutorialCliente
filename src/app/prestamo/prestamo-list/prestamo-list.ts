import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PrestamoEdit } from '../prestamo-edit/prestamo-edit';
import { PrestamoService } from '../prestamo';
import { Prestamo } from '../model/Prestamo';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';

@Component({
  selector: 'app-prestamo-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, CommonModule, MatPaginatorModule],
  templateUrl: './prestamo-list.html',
  styleUrl: './prestamo-list.scss',
})
export class PrestamoList implements OnInit {
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Prestamo>();
  displayedColumns: string[] = ['id', 'gameTitle', 'clientName', 'fechaPrestamo', 'fechaDevolucion','action'];

  constructor(
    private prestamoService: PrestamoService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(event?: PageEvent) {
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: [
        {
          property: 'id',
          direction: 'ASC',
        },
      ],
    };

    if (event != null) {
      pageable.pageSize = event.pageSize;
      pageable.pageNumber = event.pageIndex;
    }

    this.prestamoService.getPrestamos(pageable).subscribe((data) => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
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
      this.ngOnInit();
    });
  }

  deletePrestamo(prestamo: Prestamo) {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        title: 'Eliminar autor',
        description:
          'Atención si borra el autor se perderán sus datos.<br> ¿Desea eliminar el autor?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.prestamoService.deletePrestamo(prestamo.id).subscribe((result) => {
          this.ngOnInit();
        });
      }
    });
  }
}