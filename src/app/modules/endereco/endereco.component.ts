import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { EnderecosService } from 'src/app/core/services/enderecos.service';
import { Endereco } from 'src/app/shared/models/endereco';
import { EnderecoDialogComponent } from 'src/app/shared/components/endereco-dialog/endereco-dialog.component';

@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.component.html',
  styleUrls: ['./endereco.component.css']
})
export class EnderecoComponent implements AfterViewInit {

  resultsLength: number;
  isLoadingResults = true;
  displayedColumns: string[] = ['id', 'cep', 'logradouro', 'numero', 'complemento', 'bairro', 'localidade', 'uf', 'actions'];
  dataSource: MatTableDataSource<Endereco>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private enderecosService: EnderecosService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;

          return this.enderecosService.listarEnderecos(
            this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.data.totalSize;
          return data.data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
  }

  adicionarEndereco(): void {
    const dialogRef = this.dialog.open(EnderecoDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap(endereco => {
          this.isLoadingResults = true;
          return endereco ? this.enderecosService.inserirEndereco(endereco) : observableOf(null);
        })
      ).subscribe(data => {
        if(data) this.ngAfterViewInit();
        else this.isLoadingResults = false;
        
      }, (error: HttpErrorResponse) => {        
        console.log(error.error);
        this.isLoadingResults = false;
      });
  }  

  editarEndereco(endereco: Endereco): void {
    const dialogRef = this.dialog.open(EnderecoDialogComponent, {
      width: '250px',
      data: { endereco }
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap(enderecoRetorno => {
          this.isLoadingResults = true;
          return enderecoRetorno ? this.enderecosService.editarEndereco(enderecoRetorno) : observableOf(null);
        })
      ).subscribe(data => {
        if(data) this.ngAfterViewInit();
        else this.isLoadingResults = false;
        
      }, (error: HttpErrorResponse) => {        
        console.log(error.error);
        this.isLoadingResults = false;
      });
  }  

  removerEndereco(endereco : Endereco) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '270px',
      data: { 
        title: 'Confirmar', 
        message: `Deseja remover o enderco ${endereco.id} ? `
      }
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap(removerEndereco => {
          this.isLoadingResults = true;
          return removerEndereco ? this.enderecosService.removerEndereco(endereco) : observableOf(null);
        })
      ).subscribe(data => {
        if(data) this.ngAfterViewInit();
        else this.isLoadingResults = false;
        
      }, (error: HttpErrorResponse) => {        
        console.log(error.error);
        this.isLoadingResults = false;
      });
  } 

}
