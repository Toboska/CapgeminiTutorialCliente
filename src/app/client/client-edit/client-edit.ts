import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../client';
import { Client } from '../model/Client';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './client-edit.html',
  styleUrl: './client-edit.scss',
})
export class ClientEdit implements OnInit {

  client!: Client;

  // Mensaje de error del backend
  nameError?: string;

  // Referencia al ngModel del campo name
  @ViewChild('nameModel') nameModel!: NgModel;

  constructor(
    public dialogRef: MatDialogRef<ClientEdit>,
    @Inject(MAT_DIALOG_DATA) public data: { client: Client },
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.client = this.data.client
      ? Object.assign({}, this.data.client)
      : new Client();
  }

  onSave(): void {

    if (this.nameModel.invalid) {
      this.nameModel.control.markAsTouched();
      return;
    }

    this.nameError = undefined;
    this.removeBackendError();

    this.clientService.saveClient(this.client).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (error) => {
        const apiError = error.error;

        if (apiError?.field === 'name') {
          this.nameError = apiError.message;

          this.nameModel.control.setErrors({
            ...this.nameModel.control.errors,
            backend: true
          });

          this.nameModel.control.markAsTouched();
        }
      }
    });
  }

  clearNameError(): void {
    this.nameError = undefined;
    this.removeBackendError();
  }

  private removeBackendError(): void {
    const errors = this.nameModel.control.errors;

    if (errors?.['backend']) {
      delete errors['backend'];

      if (Object.keys(errors).length === 0) {
        this.nameModel.control.setErrors(null);
      } else {
        this.nameModel.control.setErrors(errors);
      }
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}