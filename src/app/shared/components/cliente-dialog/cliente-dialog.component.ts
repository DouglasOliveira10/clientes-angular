import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-cliente-dialog',
  templateUrl: './cliente-dialog.component.html',
  styleUrls: ['./cliente-dialog.component.css']
})
export class ClienteDialogComponent implements OnInit {

  tituloDialog: string;
  clienteGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ClienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {

    if (this.data) {

      this.tituloDialog = 'Editar';
      this.clienteGroup = this.formBuilder.group({
        id: new FormControl(this.data.cliente.id),
        nome: new FormControl(this.data.cliente.nome, [Validators.required]),
        idade: new FormControl(this.data.cliente.idade, [Validators.required]),
        idEndereco: new FormControl(this.data.cliente.idEndereco)
        
      });
     
    } else {      
      
      this.tituloDialog = 'Adicionar';
      this.clienteGroup = this.formBuilder.group({
        id: new FormControl(),
        nome: new FormControl('', [Validators.required]),
        idade: new FormControl('', [Validators.required]),
        idEndereco: new FormControl(1)
      });
      
    }
  }

  onFinish() {
    const cliente: Cliente = {
      id: this.clienteGroup.get('id').value,
      nome: this.clienteGroup.get('nome').value,
      idade: this.clienteGroup.get('idade').value,
      idEndereco: this.clienteGroup.get('idEndereco').value
    };

    this.dialogRef.close(cliente);
  }
}
