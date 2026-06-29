import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Category } from '../../models/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }

  buscarPorId(id: number): Observable<Category> {
    return this.http.get<Category>(`${environment.apiUrl}/categories/${id}`);
  }
}
