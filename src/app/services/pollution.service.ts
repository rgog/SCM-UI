import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import config from '../../assets/config/dev-config.json';

@Injectable({
  providedIn: 'root'
})
export class PollutionService {

  baseURL = config.API_ENDPOINTS.BASE_URL + "/polls";
  constructor(private httpClient: HttpClient) { }

  fetchAllPollutionLatLongs(){
    return this.httpClient.get(this.baseURL, {
      headers: new HttpHeaders({
           'Content-Type':  'application/json',
         })
      });
  }
  fetchPollutionDetails(): Observable<Object> {
    return this.httpClient.get(this.baseURL, {
      headers: new HttpHeaders({
           'Content-Type':  'application/json',
         })
      });
  }
}
