import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultView } from '../models/common/result-view';
import { extractFilterObjectToQueryString } from './search-utils';
import { Data1Suggestion } from '../models/common/data-with-suggestion';
import { NewsPaperPost } from '../models/news-paper-post';

@Injectable({
  providedIn: 'root'
})
export class NewsPaperPostService extends BaseService {
  constructor(private _http: HttpClient) {
    super();
  }

  public searchAdmin(payload: any) {
    return this._http.get<ResultView<NewsPaperPost>>(`${this.host}/api/bao-chi/admin/search${extractFilterObjectToQueryString(payload)}`, this.getRequestHeaders());
  }
  public loadById(id: string): Observable<Data1Suggestion<NewsPaperPost, any>> {
    return this._http.get<Data1Suggestion<NewsPaperPost, any>>(`${this.host}/api/bao-chi/admin/${id}`, this.getRequestHeaders());
  }

  public create(newsPaperPost: NewsPaperPost): Observable<any> {
    return this._http.post<any>(`${this.host}/api/bao-chi/admin/create`, newsPaperPost, this.getRequestHeaders());
  }

  public update(newsPaperPost: NewsPaperPost): Observable<any> {
    return this._http.put<any>(`${this.host}/api/bao-chi/admin/update`, newsPaperPost, this.getRequestHeaders());
  }
  public delete(newsPaperPost: NewsPaperPost): Observable<any> {
    return this._http.delete<any>(`${this.host}/api/bao-chi/admin/delete/${newsPaperPost.Id}`, this.getRequestHeaders());
  }

  public savePosition(rows: NewsPaperPost[]) {
    return this._http.put<any>(`${this.host}/api/bao-chi/admin/save-position`,
      rows.map((d, i) => {
        return {
          Id: d.Id,
          Index: i + 1
        }
      }), this.getRequestHeaders());
  }

}
