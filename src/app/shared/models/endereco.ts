export interface Endereco {
    id?: number;
    cep: string;
    logradouro?: string;
    numero: number;
    complemento?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
}