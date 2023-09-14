import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HomePageData, HompageContent } from '../models/homepage.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService extends BaseService {

  constructor(private _http: HttpClient) {
      super();
  }

  public getHomePageConfig(): Observable<HomePageData> {
    return this._http.get<HomePageData>(`${this.host}/api/home`, this.getRequestHeaders());
  }

  public getHomePageContent(): Observable<HompageContent> {
    return this._http.get<HompageContent>(`${this.host}/api/configs/home-page-content`, this.getRequestHeaders());
  }

  public loadAboutUs(): Observable<string> {
    return this._http.get<string>(`${this.host}/api/configs/about-us`, this.getRequestHeaders());
  }
}   
