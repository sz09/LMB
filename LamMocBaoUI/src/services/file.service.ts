import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Province } from '../models/common/address';
import { LiteFile } from '../models/lite-file';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class FileService extends BaseService {

  constructor(private _http: HttpClient) {
      super();
  }

  public getVNAddress(): Observable<Province[]> {
    return this._http.get<Province[]>('./assets/vn-address.json', this.getRequestHeaders());
  }

  public uploadFile(file: File, entityId: string): Observable<LiteFile> {
    const formData: FormData = new FormData();
    formData.append(file.name, file);
    formData.append('entityId', entityId);
    let headers = new HttpHeaders({
      'Accept': `"multipart/form-data`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Cross-Origin': ''
    });
    return this._http.post<LiteFile>(`${this.host}/api/files/upload`, formData, { headers: headers });
  }

  public uploadFiles(files: File[], entityId: string): Observable<LiteFile[]> {
    const formData: FormData = new FormData();
    files.forEach(file => {
      formData.append(file.name, file);
    })
    formData.append('entityId', entityId);
    let headers = new HttpHeaders({
      'Accept': `"multipart/form-data`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Cross-Origin': ''
    });
    return this._http.post<LiteFile[]>(`${this.host}/api/files/uploads`, formData, { headers: headers });
  }
  public uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append(file.name, file);
    let headers = new HttpHeaders({
      'Accept': `"multipart/form-data`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Cross-Origin': ''
    });
    return this._http.post<any>(`${this.host}/api/files/upload-image`, formData, { headers: headers });
  }
  public getHost(): string {
    return this.host;
  }

  public addFileFor(entityId: string, entityType: string, files: LiteFile[]): Observable<any> {
    return this._http.put<any>(`${this.host}/api/files/add-file-for`, {
      EntityId: entityId,
      EntityType: entityType,
      Files: files
    },this.getRequestHeaders());
  }

  public removeFileFor(id: string, entityType: string): Observable<any> {
    return this._http.delete<any>(`${this.host}/api/files/remove-file-for/${entityType}/${id}`,this.getRequestHeaders());
  }
}
