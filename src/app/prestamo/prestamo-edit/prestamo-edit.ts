import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrestamoService } from '../prestamo';
import { Prestamo } from '../model/Prestamo';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-prestamo-edit',
  standalone: true,
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ],
  templateUrl: './prestamo-edit.html',
  styleUrl: './prestamo-edit.scss',
})

export class PrestamoEdit implements OnInit {
  prestamo: Prestamo;

  constructor(
    public dialogRef: MatDialogRef<PrestamoEdit>,
    @Inject(MAT_DIALOG_DATA) public data: {prestamo: Prestamo},
    private prestamoService: PrestamoService
  ){}

  ngOnInit(): void {
    // Si viene un préstamo en la data, creamos una copia; si no, inicializamos uno nuevo.
    this.prestamo = this.data.prestamo ? Object.assign({}, this.data.prestamo) : new Prestamo(); 
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