import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data1Suggestion } from '../models/common/data-with-suggestion';
import { ResultView } from '../models/common/result-view';
import { SelectListItem } from '../models/common/SelectListItem';
import { Size } from '../models/size';
import { BaseService } from './base-service';
import { extractFilterObjectToQueryString } from './search-utils';

@Injectable({
  providedIn: 'root'
})
export class SizeService extends BaseService {

  constructor(private _http: HttpClient) {
      super();
  }

  public searchAdmin(payload: any) {
    return this._http.get<ResultView<Size>>(`${this.host}/api/size/admin/search${extractFilterObjectToQueryString(payload)}`, this.getRequestHeaders());
  }

  public loadById(id: string): Observable<Data1Suggestion<Size, any>> {
    return this._http.get<Data1Suggestion<Size, any>>(`${this.host}/api/size/admin/${id}`, this.getRequestHeaders());
  }

  public create(size: Size): Observable<any> {
    return this._http.post<any>(`${this.host}/api/size/admin/create`, size, this.getRequestHeaders());
  }

  public update(size: Size): Observable<any> {
    return this._http.put<any>(`${this.host}/api/size/admin/update`, size, this.getRequestHeaders());
  }

  public delete(size: Size): Observable<any> {
    return this._http.delete<any>(`${this.host}/api/size/admin/delete/${size.Id}`, this.getRequestHeaders());
  }

  public getListDropdown(): Observable<SelectListItem[]> {
    return this._http.get<SelectListItem[]>(`${this.host}/api/size/admin/drop-down`, this.getRequestHeaders());
  }

}   
