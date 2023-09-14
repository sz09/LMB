import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data1Suggestion } from '../models/common/data-with-suggestion';
import { ResultView } from '../models/common/result-view';
import { SelectListItem } from '../models/common/SelectListItem';
import { ProductType } from '../models/product-type';
import { BaseService } from './base-service';
import { extractFilterObjectToQueryString } from './search-utils';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService extends BaseService {

  constructor(private _http: HttpClient) {
      super();
  }

  public searchAdmin(payload: any) {
    return this._http.get<ResultView<ProductType>>(`${this.host}/api/product-type/admin/search${extractFilterObjectToQueryString(payload)}`, this.getRequestHeaders());
  }

  public getListDropdown(): Observable<SelectListItem[]> {
    return this._http.get<SelectListItem[]>(`${this.host}/api/product-type/admin/drop-down`, this.getRequestHeaders());
  }

  public loadById(id: string): Observable<Data1Suggestion<ProductType, any>> {
    return this._http.get<Data1Suggestion<ProductType, any>>(`${this.host}/api/product-type/admin/${id}`, this.getRequestHeaders());
  }

  public create(productType: ProductType): Observable<any> {
    return this._http.post<any>(`${this.host}/api/product-type/admin/create`, productType, this.getRequestHeaders());
  }

  public update(productType: ProductType): Observable<any> {
    return this._http.put<any>(`${this.host}/api/product-type/admin/update`, productType, this.getRequestHeaders());
  }
  public delete(productType: ProductType): Observable<any> {
    return this._http.delete<any>(`${this.host}/api/product-type/admin/delete/${productType.Id}`, this.getRequestHeaders());
  }

  public savePosition(rows: ProductType[]) {
    return this._http.put<any>(`${this.host}/api/product-type/admin/save-position`,
      rows.map((d, i) => {
        return {
          Id: d.Id,
          Index: i + 1
        }
      }), this.getRequestHeaders());
  }
}   
