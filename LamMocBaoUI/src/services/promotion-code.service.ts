import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data1Suggestion } from '../models/common/data-with-suggestion';
import { ResultView } from '../models/common/result-view';
import { Promotion } from '../models/promotion-code';
import { BaseService } from './base-service';
import { extractFilterObjectToQueryString } from './search-utils';

@Injectable({
  providedIn: 'root'
})
export class PromotionCodeService extends BaseService {
  constructor(private _http: HttpClient) {
      super();
  }

  public getPromotionCode(promotionCode: string): Observable<{ IsFound: boolean, DiscountPercent: number }> {
    return this._http.get<{ IsFound: boolean, DiscountPercent: number }>(`${this.host}/api/promotion?code=${promotionCode}`, this.getRequestHeaders());
  }

  public searchAdmin(payload: any) {
    return this._http.get<ResultView<Promotion>>(`${this.host}/api/promotion/admin/search${extractFilterObjectToQueryString(payload)}`, this.getRequestHeaders());
  }
  public loadById(id: string): Observable<Promotion> {
    return this._http.get<Promotion>(`${this.host}/api/promotion/admin/edit/${id}`, this.getRequestHeaders());
  }

  public create(promotion: Promotion): Observable<any> {
    return this._http.post<any>(`${this.host}/api/promotion/admin/create`, promotion, this.getRequestHeaders());
  }

  public update(promotion: Promotion): Observable<any> {
    return this._http.put<any>(`${this.host}/api/promotion/admin/update`, promotion, this.getRequestHeaders());
  }

  public delete(promotion: Promotion): Observable<any> {
    return this._http.delete<any>(`${this.host}/api/promotion/admin/delete/${promotion.Id}`, this.getRequestHeaders());
  }

}   
