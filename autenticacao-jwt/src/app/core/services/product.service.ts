import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Product } from '../../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Product[]> {
    const params = new HttpParams().set('limit', 100).set('offset', 0);
    return this.http.get<Product[]>(`${environment.apiUrl}/products`, { params });
  }

  buscarPorId(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }
}
