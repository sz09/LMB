import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data1Suggestion } from '../models/common/data-with-suggestion';
import { ResultView } from '../models/common/result-view';
import { KnowledgeViewModel, PublishedKnowledge, Trend } from '../models/knowledge';
import { BaseService } from './base-service';
import { extractFilterObjectToQueryString } from './search-utils';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeService extends BaseService {

  constructor(private _http: HttpClient) {
      super();
  }

  public search(payload: any): Observable<ResultView<PublishedKnowledge>> {
    return this._http.get<ResultView<PublishedKnowledge>>(`${this.host}/api/knowledge/search${extractFilterObjectToQueryString(payload)}`, this.getRequestHeaders());
  }
  
  public getByLinkName(linkName: string): Observable<KnowledgeViewModel> {
    return this._http.get<KnowledgeViewModel>(`${this.host}/api/knowledge/${linkName}`, this.getRequestHeaders());
  }
  public getPreview(id: string): Observable<KnowledgeViewModel> {
    return this._http.get<KnowledgeViewModel>(`${this.host}/api/knowledge/preview/${id}`, this.getRequestHeaders());
  }

  public searchTrend(): Observable<Trend> {
    return this._http.get<Trend>(`${this.host}/api/knowledge/trend`, this.getRequestHeaders());
  }


  public searchAdmin(payload: any) {
    return this._http.get<ResultView<KnowledgeViewModel>>(`${this.host}/api/knowledge/admin/search${extractFilterObjectToQueryString(payload)}`, this.getRequestHeaders());
  }
  public loadById(id: string): Observable<Data1Suggestion<KnowledgeViewModel, any>> {
    return this._http.get<Data1Suggestion<KnowledgeViewModel, any>>(`${this.host}/api/knowledge/admin/${id}`, this.getRequestHeaders());
  }

  public create(knowledge: KnowledgeViewModel): Observable<any> {
    return this._http.post<any>(`${this.host}/api/knowledge/admin/create`, knowledge, this.getRequestHeaders());
  }

  public update(knowledge: KnowledgeViewModel): Observable<any> {
    return this._http.put<any>(`${this.host}/api/knowledge/admin/update`, knowledge, this.getRequestHeaders());
  }
  public publish(knowledge: KnowledgeViewModel): Observable<any> {
    return this._http.post<any>(`${this.host}/api/knowledge/admin/publish?id=${knowledge.Id}`, knowledge, this.getRequestHeaders());
  }
  public delete(knowledge: KnowledgeViewModel): Observable<any> {
    return this._http.delete<any>(`${this.host}/api/knowledge/admin/delete/${knowledge.Id}`, this.getRequestHeaders());
  }

}   
