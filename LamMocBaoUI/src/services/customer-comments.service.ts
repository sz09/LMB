import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultView } from '../models/common/result-view';
import { extractFilterObjectToQueryString } from './search-utils';
import { Data1Suggestion } from '../models/common/data-with-suggestion';
import { SelectListItem } from '../models/common/SelectListItem';
import { CustomerComment } from '../models/customer-comment';

@Injectable({
  providedIn: 'root'
})
export class CustomerCommentsService extends BaseService {
  constructor(private _http: HttpClient) {
    super();
  }

  public searchAdmin(payload: any) {
    return this._http.get<ResultView<CustomerComment>>(`${this.host}/api/cam-nhan-khach-hang/admin/search${extractFilterObjectToQueryString(payload)}`, this.getRequestHeaders());
  }
  public loadById(id: string): Observable<Data1Suggestion<CustomerComment, any>> {
    return this._http.get<Data1Suggestion<CustomerComment, any>>(`${this.host}/api/cam-nhan-khach-hang/admin/${id}`, this.getRequestHeaders());
  }

  public create(customerComment: CustomerComment): Observable<string> {
    return this._http.post<string>(`${this.host}/api/cam-nhan-khach-hang/admin/create`, customerComment, this.getRequestHeaders());
  }

  public update(customerComment: CustomerComment): Observable<any> {
    return this._http.put<any>(`${this.host}/api/cam-nhan-khach-hang/admin/update`, customerComment, this.getRequestHeaders());
  }

  public delete(customerComment: CustomerComment): Observable<any> {
    return this._http.delete<any>(`${this.host}/api/cam-nhan-khach-hang/admin/delete/${customerComment.Id}`, this.getRequestHeaders());
  }

  public savePosition(rows: CustomerComment[]) {
    return this._http.put<any>(`${this.host}/api/cam-nhan-khach-hang/admin/save-position`,
      rows.map((d, i) => {
        return {
          Id: d.Id,
          Index: i + 1
        }
      }), this.getRequestHeaders());
  }
}
