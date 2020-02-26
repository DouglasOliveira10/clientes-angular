//
// um único item
//
export interface ResponseBase<T> {
    data: T;
    httpStatusCode?: number;
    errors?: string[];
    message?: string;
}

//
// uma lista de itens
//
export interface PaginatedResponse<T> {
    items?: Array<T>;
    pageNumber?: number;
    pageSize?: number;
    totalSize?: number;
}
