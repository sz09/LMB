import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuHierarchy, ProductConfig } from './external-data';
import { CountProducts, Product, SuggestionProduct } from '../models/product';
import { ResultView } from '../models/common/result-view';
import { extractFilterObjectToQueryString } from './search-utils';
import { Data1Suggestion } from '../models/common/data-with-suggestion';
import { Material } from '../models/material';
import { SelectListItem } from '../models/common/SelectListItem';

@Injectable({
  providedIn: 'root'
})
export class MaterialService extends BaseService {
  constructor(private _http: HttpClient) {
    super();
  }

  public searchAdmin(payload: any) {
    return this._http.get<ResultView<Material>>(`${this.host}/api/material/admin/search${extractFilterObjectToQueryString(payload)}`, this.getRequestHeaders());
  }
  public loadById(id: string): Observable<Data1Suggestion<Material, any>> {
    return this._http.get<Data1Suggestion<Material, any>>(`${this.host}/api/material/admin/${id}`, this.getRequestHeaders());
  }

  public create(material: Material): Observable<any> {
    return this._http.post<any>(`${this.host}/api/material/admin/create`, material, this.getRequestHeaders());
  }

  public update(material: Material): Observable<any> {
    return this._http.put<any>(`${this.host}/api/material/admin/update`, material, this.getRequestHeaders());
  }
  public delete(material: Material): Observable<any> {
    return this._http.delete<any>(`${this.host}/api/material/admin/delete/${material.Id}`, this.getRequestHeaders());
  }

  public getListDropdown(): Observable<SelectListItem[]> {
    return this._http.get<SelectListItem[]>(`${this.host}/api/material/admin/drop-down`, this.getRequestHeaders());
  }
}
