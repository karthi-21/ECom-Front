import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get(environment.baseUrl + environment.restUrl + 'product/products');
  }

  getProduct(id: string): Observable<any> {
    return this.http.get(environment.baseUrl + environment.restUrl + 'product/product/' + id);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(environment.baseUrl + environment.restUrl + 'product/create', product);
  }

  updateProduct(product: any): Observable<any> {
    return this.http.put(environment.baseUrl + environment.restUrl + 'product/update', product, { params: { productID: product._id } });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(environment.baseUrl + environment.restUrl + 'product/delete', { params: { productID: id } });
  }
}
