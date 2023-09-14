import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CategoryGroup, LiteMaterial } from '../models/category';
import { ResultView } from '../models/common/result-view';
import { extractFilterObjectToQueryString } from './search-utils';
import { Data1Suggestion } from '../models/common/data-with-suggestion';
import { SelectListItem } from '../models/common/SelectListItem';


export enum DisplayMode {
  ShowAll = 1,
  ChangePositionHomepage = 2,
  ChangePositionFilter = 3
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {

  constructor(private _http: HttpClient) {
      super();
  }

  public getByElements(): Observable<Category[]> {
    return this._http.get<Category[]>(`${this.host}/api/category/list?categoryGroup=${CategoryGroup.VatPhamTheoNguHanh}`, this.getRequestHeaders());
  }

  public getByMaterials(): Observable<LiteMaterial[]> {
    return this._http.get<LiteMaterial[]>(`${this.host}/api/category/list?categoryGroup=${CategoryGroup.VatPhamTheoChatLieu}`, this.getRequestHeaders());
  }

  public searchAdmin(payload: any) {
    return this._http.get<ResultView<Category>>(`${this.host}/api/category/admin/search${extractFilterObjectToQueryString(payload)}`, this.getRequestHeaders());
  }

  public updateShowOnFilter(id: string, value: boolean) {
    return this._http.put<any>(`${this.host}/api/category/admin/update-show-on-filter?id=${id}&value=${value}`, this.getRequestHeaders());
  }

  public updateShowOnHomePage(id: string, value: boolean) {
    return this._http.put<any>(`${this.host}/api/category/admin/update-show-on-homepage?id=${id}&value=${value}`, this.getRequestHeaders());
  }

  public savePosition(rows: any[], mode: DisplayMode) {
    return this._http.put<any>(`${this.host}/api/category/admin/save-position`,
      {
        Positions: rows,
        Type: mode
      }, this.getRequestHeaders());
  }

  public loadById(id: string): Observable<Data1Suggestion<Category, any>> {
    return this._http.get<Data1Suggestion<Category, any>>(`${this.host}/api/category/admin/${id}`, this.getRequestHeaders());
  }

  public createCategory(category: Category): Observable<any> {
    return this._http.post<string>(`${this.host}/api/category/admin/create`, category, this.getRequestHeaders());
  }
  
  public updateCategory(category: Category): Observable<any> {
    return this._http.put<any>(`${this.host}/api/category/admin/update`, category, this.getRequestHeaders());
  }
  public deleteCategory(category: Category): Observable<any> {
    return this._http.delete<any>(`${this.host}/api/category/admin/delete/${category.Id}`, this.getRequestHeaders());
  }

  public getListDropdown(): Observable<SelectListItem[]> {
    return this._http.get<SelectListItem[]>(`${this.host}/api/category/admin/drop-down`, this.getRequestHeaders());
  }
  public getPublicListDropdown(): Observable<SelectListItem[]> {
    return this._http.get<SelectListItem[]>(`${this.host}/api/category/drop-down`, this.getRequestHeaders());
  }
}   
