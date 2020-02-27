import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Endereco } from '../../models/endereco';
import { EnderecosService } from 'src/app/core/services/enderecos.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-endereco-dialog',
  templateUrl: './endereco-dialog.component.html',
  styleUrls: ['./endereco-dialog.component.css']
})
export class EnderecoDialogComponent implements OnInit {

  tituloDialog: string;
  enderecoGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EnderecoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private enderecosService: EnderecosService) {
  }

  ngOnInit(): void {

    if (this.data) {

      this.tituloDialog = 'Editar';
      this.enderecoGroup = this.formBuilder.group({
        id: new FormControl(this.data.endereco.id),
        cep: new FormControl(this.data.endereco.cep, [Validators.required]),
        logradouro: new FormControl(this.data.endereco.logradouro, [Validators.required]),
        numero: new FormControl(this.data.endereco.numero, [Validators.required]),
        complemento: new FormControl(this.data.endereco.complemento, [Validators.required]),
        bairro: new FormControl(this.data.endereco.bairro, [Validators.required]),
        localidade: new FormControl(this.data.endereco.localidade, [Validators.required]),
        uf: new FormControl(this.data.endereco.uf, [Validators.required])
        
      });
     
    } else {      
      
      this.tituloDialog = 'Adicionar';
      this.enderecoGroup = this.formBuilder.group({
        id: new FormControl(),
        cep: new FormControl('', [Validators.required]),
        logradouro: new FormControl({value: '', disabled: true}, [Validators.required]),
        numero: new FormControl('', [Validators.required]),
        complemento: new FormControl(''),
        bairro: new FormControl({value: '', disabled: true}, [Validators.required]),
        localidade: new FormControl({value: '', disabled: true}, [Validators.required]),
        uf: new FormControl({value: '', disabled: true}, [Validators.required])
      });
      
    }
  }

  buscarEndereco(event: Event) {
    const cep = (event.target as HTMLInputElement).value;

    if(cep) {
      this.enderecosService.buscarEnderecoPorCep(cep).subscribe(data => {
        const endereco: Endereco = data.data;
        this.enderecoGroup.get('logradouro').setValue(endereco.logradouro);
        this.enderecoGroup.get('bairro').setValue(endereco.bairro);
        this.enderecoGroup.get('localidade').setValue(endereco.localidade);
        this.enderecoGroup.get('uf').setValue(endereco.uf);
      }, (error: HttpErrorResponse) => {        
        console.log(error.error);
        this.enderecoGroup.get('logradouro').setValue('');
        this.enderecoGroup.get('bairro').setValue('');
        this.enderecoGroup.get('localidade').setValue('');
        this.enderecoGroup.get('uf').setValue('');
      });
    }
  }

  onFinish() {
    const endereco: Endereco = {
      id: this.enderecoGroup.get('id').value,
      cep: this.enderecoGroup.get('cep').value,
      logradouro: this.enderecoGroup.get('logradouro').value,
      numero: this.enderecoGroup.get('numero').value,
      complemento: this.enderecoGroup.get('complemento').value,
      bairro: this.enderecoGroup.get('bairro').value,
      localidade: this.enderecoGroup.get('localidade').value,
      uf: this.enderecoGroup.get('uf').value
    };

    this.dialogRef.close(endereco);
  }

}
