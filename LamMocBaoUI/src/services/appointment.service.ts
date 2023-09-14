import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';
import { ResultView } from '../models/common/result-view';
import { Data1Suggestion } from '../models/common/data-with-suggestion';
import { extractFilterObjectToQueryString } from './search-utils';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService extends BaseService {

  constructor(private _http: HttpClient) {
      super();
  }

  public getInterestServices(): Observable<{Key: string, Value: string}[]> {
    return this._http.get<{ Key: string, Value: string }[]>(`${this.host}/api/appointment/interest-services`, this.getRequestHeaders());
  }

  public makeAAppointment(model: Appointment): Observable<any> {
    return this._http.post<any>(`${this.host}/api/appointment/make-a-appointment`, JSON.stringify(model), this.getRequestHeaders());
  }

  public searchAdmin(payload: any) {
    return this._http.get<ResultView<Appointment>>(`${this.host}/api/appointment/admin/search${extractFilterObjectToQueryString(payload)}`, this.getRequestHeaders());
  }
  public loadById(id: string): Observable<Data1Suggestion<Appointment, any>> {
    return this._http.get<Data1Suggestion<Appointment, any>>(`${this.host}/api/appointment/admin/${id}`, this.getRequestHeaders());
  }
}
