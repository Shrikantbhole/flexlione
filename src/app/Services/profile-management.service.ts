import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import {catchError, retry} from 'rxjs/operators';
import {ServerConfigService} from '../settings/server-config.service';
import {HandlerError} from '../settings/handle-error.service';
import {ProfileModel} from '../profile/models/profile.model';
import {ProfileStoreModel} from '../shared/store/interfaces/profile-store.model';

// export keyword is same as public keyword in C# and Java. If export keyword is used, the class
// can used in other files.

@Injectable()
export class ProfileManagementService {


  // trailing underscore is a naming convention for private variables of the class.
  private http_: HttpClient;

  private baseUrl: string ;




  constructor(http: HttpClient, serverConfigService: ServerConfigService) { // pass by reference
    this.http_ = http;
    this.baseUrl = serverConfigService.getBaseUrl();
  }
  // Returns an observable for list of Line Items
  getProfileById(profileId: string, include: string): Observable<ProfileModel> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };

    const queryStringParams
      = {
      include: include,
      profileId: profileId
    };


    return this.http_.get<ProfileModel>(this.baseUrl + '/Profile/GetProfileById', { params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  getAllProfiles(): Observable<ProfileStoreModel[]> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };

    return this.http_.get<ProfileStoreModel[]>(this.baseUrl + '/Profile/GetAllProfiles', { headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  deleteProfile(profileId: string): Observable<void> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };
    const queryStringParams = {
      profileId: profileId
    };
    return this.http_.delete<void>(this.baseUrl + '/Profile/DeleteProfile', { params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

 AddOrUpdateProfile(profileModel: ProfileModel): Observable<ProfileModel> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json;v=1.0'
    };

    return this.http_.put<ProfileModel>(this.baseUrl + '/Profile/AddOrUpdateProfile', ProfileModel, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }



}
