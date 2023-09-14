import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultView } from '../models/common/result-view';
import { extractFilterObjectToQueryString } from './search-utils';
import { Data1Suggestion } from '../models/common/data-with-suggestion';
import { Tag } from '../models/tag';
import { SelectListItem } from '../models/common/SelectListItem';

@Injectable({
  providedIn: 'root'
})
export class TagService extends BaseService {
  constructor(private _http: HttpClient) {
    super();
  }

  public searchAdmin(payload: any) {
    return this._http.get<ResultView<Tag>>(`${this.host}/api/tag/admin/search${extractFilterObjectToQueryString(payload)}`, this.getRequestHeaders());
  }
  public loadById(id: string): Observable<Data1Suggestion<Tag, any>> {
    return this._http.get<Data1Suggestion<Tag, any>>(`${this.host}/api/tag/admin/${id}`, this.getRequestHeaders());
  }

  public create(tag: Tag): Observable<any> {
    return this._http.post<any>(`${this.host}/api/tag/admin/create`, tag, this.getRequestHeaders());
  }

  public update(tag: Tag): Observable<any> {
    return this._http.put<any>(`${this.host}/api/tag/admin/update`, tag, this.getRequestHeaders());
  }
  public delete(tag: Tag): Observable<any> {
    return this._http.delete<any>(`${this.host}/api/tag/admin/delete/${tag.Id}`, this.getRequestHeaders());
  }

  public getListDropdown(): Observable<SelectListItem[]> {
    return this._http.get<SelectListItem[]>(`${this.host}/api/tag/admin/drop-down`, this.getRequestHeaders());
  }
}
