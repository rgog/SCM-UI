import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import config from '../../assets/config/dev-config.json';

@Injectable({
  providedIn: 'root'
})
export class BikesService {
  
  baseURL = config.API_ENDPOINTS.BASE_URL + "/bikes";

  constructor(private httpClient: HttpClient) { }

  fetchBikeDetails(){
    return this.httpClient.get(this.baseURL, {
      headers: new HttpHeaders({
           'Content-Type':  'application/json',
         })
      });
  }
}
