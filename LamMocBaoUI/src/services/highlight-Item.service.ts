import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonResponse } from '../models/common/common-response';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class HighlightItemService extends BaseService {

  constructor(private _http: HttpClient) {
      super();
  }

  public doHighlightItem(id: string, type: HighlightEntityType): Observable<CommonResponse> {
    return this._http.put<CommonResponse>(`${this.host}/api/highlight-item/admin/auto?entityId=${id}&entityType=${type}`, this.getRequestHeaders());
  }
  public highlightItems(ids: string[], type: HighlightEntityType) {
    return this._http.put<string[]>(`${this.host}/api/highlight-item/admin/current`, {
      EntityType: type,
      EntityIds: ids
    },this.getRequestHeaders());
  }
}   

export enum HighlightEntityType {
    Products = 1,
    Knowledges = 2,
}
