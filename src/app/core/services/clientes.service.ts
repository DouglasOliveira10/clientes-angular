import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseBase, PaginatedResponse } from 'src/app/shared/models/response-base';
import { Cliente } from 'src/app/shared/models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private httpClient: HttpClient) { }

  public listarClientes(page?: number, size?: number, sortBy?: string, sortDirection?: string): Observable<ResponseBase<PaginatedResponse<Cliente>>> {

    let params = new HttpParams();
    if (page) params = params.append('page', page.toString());
    if (size) params = params.append('size', size.toString());
    if (sortBy) params = params.append('sortBy', sortBy);
    if (sortDirection) params = params.append('sortDirection', sortDirection);

    return this.httpClient.get<ResponseBase<PaginatedResponse<Cliente>>>(`${environment.baseUrl}/clientes`, { params: params });
  }

  inserirCliente(cliente: Cliente): Observable<ResponseBase<Cliente>> {
    return this.httpClient.post<ResponseBase<Cliente>>(`${environment.baseUrl}/clientes`, cliente);
  }

  editarCliente(cliente: Cliente): Observable<ResponseBase<Cliente>> {
    return this.httpClient.put<ResponseBase<Cliente>>(`${environment.baseUrl}/clientes/${cliente.id}`, cliente);
  }

  removerCliente(cliente: Cliente): Observable<ResponseBase<Cliente>> {
  return this.httpClient.delete<ResponseBase<Cliente>>(`${environment.baseUrl}/clientes/${cliente.id}`);
  }
}
