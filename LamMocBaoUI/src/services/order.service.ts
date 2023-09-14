import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultView } from '../models/common/result-view';
import { LiteOrderModel, OrderDetailModel, OrderStatus } from '../models/order';
import { BaseService } from './base-service';
import { extractFilterObjectToQueryString } from './search-utils';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService {

  constructor(private _http: HttpClient) {
      super();
  }

  public searchAdmin(payload: any) {
    return this._http.get<ResultView<LiteOrderModel>>(`${this.host}/api/order/admin/search${extractFilterObjectToQueryString(payload)}`, this.getRequestHeaders());
  }

  public loadById(id: string): Observable<OrderDetailModel> {
    return this._http.get<OrderDetailModel>(`${this.host}/api/order/admin/${id}`, this.getRequestHeaders());
  }

  public changeToStatus(id: string, orderStatus: OrderStatus): Observable<OrderDetailModel> {
    return this._http.post<OrderDetailModel>(`${this.host}/api/order/admin/change-status?orderId=${id}&orderStatus=${orderStatus}`, {}, this.getRequestHeaders());
  }
}   
