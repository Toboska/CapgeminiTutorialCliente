import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../client';
import { Client } from '../model/Client';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-edit',
  imports: [FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule],
  templateUrl: './client-edit.html',
  styleUrl: './client-edit.scss',
})

export class ClientEdit implements OnInit{
  client: Client;

  constructor(
    public dialogRef: MatDialogRef<ClientEdit>,
    @Inject(MAT_DIALOG_DATA) public data: {client: Client},
    private clientService: ClientService
  ){}

  ngOnInit(): void {
    this.client = this.data.client ? Object.assign({}, this.data.client) : new Client(); 
  }

  onSave() {
    this.clientService.saveClient(this.client).subscribe(() => {
    this.dialogRef.close();
    });
  }
    
  onClose() {
    this.dialogRef.close();
  }
}
 