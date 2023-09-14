import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductCart } from '../models/product-cart';
import { CartItem } from '../models/common/cart-item';
import { OrderModel } from '../models/order';
import { CommonResponse } from '../models/common/common-response';
import { OrderSuccessInfos } from '../models/order-success-info';

@Injectable({
  providedIn: 'root'
})
export class CartService extends BaseService {

  constructor(private _http: HttpClient) {
      super();
  }

  public getFullCartInfos(cartItems: CartItem[]): Observable<ProductCart[]> {
    return this._http.post<ProductCart[]>(`${this.host}/api/cart/full-cart-infos`, JSON.stringify(cartItems), this.getRequestHeaders());
  }

  public getOrderSuccessInfos(): Observable<OrderSuccessInfos> {
    return this._http.get<OrderSuccessInfos>(`${this.host}/api/configs/order-success-infos`, this.getRequestHeaders());
  }

  public doOrder(order: OrderModel, productCarts: ProductCart[], promotionCode: string): Observable<CommonResponse> {
    return this._http.post<CommonResponse>(`${this.host}/api/order/do-order?promotionCode=${promotionCode}`, JSON.stringify({ productCarts: productCarts, order: order, promotionCode: promotionCode }), this.getRequestHeaders());
  }
}   
