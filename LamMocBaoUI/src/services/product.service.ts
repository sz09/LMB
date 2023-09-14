import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuHierarchy, ProductConfig } from './external-data';
import { CountProducts, Product, ProductDetail, SuggestionProduct } from '../models/product';
import { ResultView } from '../models/common/result-view';
import { extractFilterObjectToQueryString } from './search-utils';
import { Data1Suggestion } from '../models/common/data-with-suggestion';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService {

  constructor(private _http: HttpClient) {
      super();
  }

  public getMenu(): Observable<MenuHierarchy> {
    return this._http.get<MenuHierarchy>(`${this.host}/api/product/menu`, this.getRequestHeaders());
  }

  public getConfig(): Observable<ProductConfig> {
    return this._http.get<ProductConfig>(`${this.host}/api/product/config`, this.getRequestHeaders());
  }

  public search(payload: any): Observable<ResultView<Product>> {
    return this._http.get<ResultView<Product>>(`${this.host}/api/product/search${extractFilterObjectToQueryString(payload)}`, this.getRequestHeaders());
  }
  
  public getByLinkName(linkName: string): Observable<Data1Suggestion<Product, Product>> {
    return this._http.get<Data1Suggestion<Product, Product>>(`${this.host}/api/product/by-link-name?name=${linkName}`, this.getRequestHeaders());
  }

  public getSuggestionProducts(id: string): Observable<SuggestionProduct[] > {
    return this._http.get<SuggestionProduct[]>(`${this.host}/api/product/suggestion?id=${id}`, this.getRequestHeaders());
  }

  public countProductByTypes(): Observable<CountProducts[]> {
    return this._http.get<CountProducts[]>(`${this.host}/api/product/product-count-by-types`, this.getRequestHeaders());
  }


  public searchAdmin(payload: any) {
    return this._http.get<ResultView<Product>>(`${this.host}/api/product/admin/search${extractFilterObjectToQueryString(payload)}`, this.getRequestHeaders());
  }

  public loadById(id: string): Observable<ProductDetail> {
    return this._http.get<ProductDetail>(`${this.host}/api/product/admin/${id}`, this.getRequestHeaders());
  }

  public create(product: ProductDetail): Observable<string> {
    return this._http.post<string>(`${this.host}/api/product/admin/create`, product, this.getRequestHeaders());
  }

  public update(product: ProductDetail): Observable<any> {
    return this._http.put<any>(`${this.host}/api/product/admin/update`, product, this.getRequestHeaders());
  }
  public delete(product: Product): Observable<any> {
    return this._http.delete<any>(`${this.host}/api/product/admin/delete/${product.Id}`, this.getRequestHeaders());
  }
}   
