import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AboutUs, SystemSetting } from '../models/system-setting';
import { BaseService } from './base-service';
import { ContactInfo, PaymentInfos } from './external-data';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingService extends BaseService {

  constructor(private _http: HttpClient) {
      super();
  }

  public getContactInfos(): Observable<ContactInfo> {
    return this._http.get<ContactInfo>(`${this.host}/api/configs/contact-infos`, this.getRequestHeaders());
  }

  public getPaymentInfos(): Observable<PaymentInfos> {
    return this._http.get<PaymentInfos>(`${this.host}/api/configs/payment-infos`, this.getRequestHeaders());
  }

  public load(): Observable<SystemSetting> {
    return this._http.get<SystemSetting>(`${this.host}/api/system-setting`, this.getRequestHeaders());
  }

  public save(model: SystemSetting): Observable<any> {
    return this._http.put<any>(`${this.host}/api/system-setting`, model, this.getRequestHeaders());
  }

  public updateAboutUs(model: AboutUs): Observable<any> {
    return this._http.put<any>(`${this.host}/api/system-setting/about-us`, model, this.getRequestHeaders());
  }
}
