import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseBase, PaginatedResponse } from 'src/app/shared/models/response-base';
import { Endereco } from 'src/app/shared/models/endereco';

@Injectable({
  providedIn: 'root'
})
export class EnderecosService {

  constructor(private httpClient: HttpClient) { }

  public listarEnderecos(page?: number, size?: number, sortBy?: string, sortDirection?: string): Observable<ResponseBase<PaginatedResponse<Endereco>>> {

    let params = new HttpParams();
    if (page) params = params.append('page', page.toString());
    if (size) params = params.append('size', size.toString());
    if (sortBy) params = params.append('sortBy', sortBy);
    if (sortDirection) params = params.append('sortDirection', sortDirection);

    return this.httpClient.get<ResponseBase<PaginatedResponse<Endereco>>>(`${environment.baseUrl}/enderecos`, { params: params });
  }

  inserirEndereco(endereco: Endereco): Observable<ResponseBase<Endereco>> {
    return this.httpClient.post<ResponseBase<Endereco>>(`${environment.baseUrl}/enderecos`, endereco);
  }

  editarEndereco(endereco: Endereco): Observable<ResponseBase<Endereco>> {
    return this.httpClient.put<ResponseBase<Endereco>>(`${environment.baseUrl}/enderecos/${endereco.id}`, endereco);
  }

  removerEndereco(endereco: Endereco): Observable<ResponseBase<Endereco>> {
    return this.httpClient.delete<ResponseBase<Endereco>>(`${environment.baseUrl}/enderecos/${endereco.id}`);
  }

  buscarEnderecoPorCep(cep: string): Observable<ResponseBase<Endereco>> {
    return this.httpClient.get<ResponseBase<Endereco>>(`${environment.baseUrl}/enderecos/cep/${cep}`);
  }

}
