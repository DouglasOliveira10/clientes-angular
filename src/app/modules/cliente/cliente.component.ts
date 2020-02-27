import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ClientesService } from 'src/app/core/services/clientes.service';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/shared/models/cliente';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ClienteDialogComponent } from 'src/app/shared/components/cliente-dialog/cliente-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements AfterViewInit {

  resultsLength: number;
  isLoadingResults = true;
  displayedColumns: string[] = ['id', 'nome', 'idade', 'actions'];
  dataSource: MatTableDataSource<Cliente>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private clientesService: ClientesService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;

          return this.clientesService.listarClientes(
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

  adicionarCliente(): void {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap(cliente => {
          this.isLoadingResults = true;
          return cliente ? this.clientesService.inserirCliente(cliente) : observableOf(null);
        })
      ).subscribe(data => {
        if(data) this.ngAfterViewInit();
        else this.isLoadingResults = false;
        
      }, (error: HttpErrorResponse) => {        
        console.log(error.error);
        this.isLoadingResults = false;
      });
  }  

  editarCliente(cliente: Cliente): void {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      width: '250px',
      data: { cliente }
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap(clienteRetorno => {
          this.isLoadingResults = true;
          return clienteRetorno ? this.clientesService.editarCliente(clienteRetorno) : observableOf(null);
        })
      ).subscribe(data => {
        if(data) this.ngAfterViewInit();
        else this.isLoadingResults = false;
        
      }, (error: HttpErrorResponse) => {        
        console.log(error.error);
        this.isLoadingResults = false;
      });
  }  

  removerCliente(cliente : Cliente) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '270px',
      data: { 
        title: 'Confirmar', 
        message: `Deseja remover o cliente ${cliente.id} ? `
      }
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap(removerCliente => {
          this.isLoadingResults = true;
          return removerCliente ? this.clientesService.removerCliente(cliente) : observableOf(null);
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
