import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private _http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(`${this.apiUrl}/products`);
  }

  createProduct(product: Product): Observable<Product> {
    return this._http.post<Product>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this._http.put<Product>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<Product> {
    return this._http.delete<Product>(`${this.apiUrl}/products/${id}`, {});
  }
}
