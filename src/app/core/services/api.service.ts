import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable ,  throwError } from 'rxjs';

import { JwtService } from './jwt.service';
import { catchError } from 'rxjs/operators';
import {ProfileManagementService} from '../../Services/profile-management.service';
import {ServerConfigService} from '../../settings/server-config.service';

@Injectable()
export class ApiService {
  private baseUrl = '';
  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private profileManagementService: ProfileManagementService,
    private serverConfigService: ServerConfigService
  ) {
    this.baseUrl = serverConfigService.getBaseUrl();
  }

   httpHeaders = {
    'Content-Type': 'application/json',
    'accept': 'application/json;v=1.0'
  };
  private formatErrors(error: any) {
    return  throwError(error.error);
  }

  /*
  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.profileManagementService.getProfileById('2', null)
      .pipe(catchError(this.formatErrors));
  }
   */

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.api_url}${path}`,
      JSON.stringify(body), { headers: this.httpHeaders}
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: any): Observable<any> {
    return this.http.post(
      this.baseUrl + path,
      body, { headers: this.httpHeaders}
    ).pipe(catchError(this.formatErrors));
  }

  get(path: string,  params: any): Observable<any> {

    return this.http.get(
      this.baseUrl + path, {params: params, headers: this.httpHeaders}
    ).pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.api_url}${path}`
    ).pipe(catchError(this.formatErrors));
  }
}
