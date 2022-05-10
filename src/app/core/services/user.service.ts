import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable ,  BehaviorSubject ,  ReplaySubject } from 'rxjs';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';
import { map ,  distinctUntilChanged } from 'rxjs/operators';
import {ProfileModel} from '../../profile/models/profile.model';


@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<ProfileModel>({} as ProfileModel);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor (
    private apiService: ApiService,
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
    let params = new HttpParams();
    params = params.append('profileId', this.jwtService.getToken().toString());
      return this.apiService.get('/Profile/GetProfileById', params)
      .subscribe(
        data => {
          this.setAuth(data);
        },
        err => this.purgeAuth()
      );
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: ProfileModel) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.profileId);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as ProfileModel);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type, credentials): Observable<ProfileModel> {
    const route = (type === 'login') ? '/login' : '';
    let params = new HttpParams();
    params = params.append('emailId', credentials.email);
    params = params.append('password', credentials.password);
    return this.apiService.get('/Profile/AuthenticateProfile', params)
      .pipe(map(
      data => {
        this.setAuth(data);
        return data;
      }
    ));
  }

  getCurrentUser(): ProfileModel {
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(profile: ProfileModel): Observable<ProfileModel> {
    return this.apiService
    .post('/Profile/AddOrUpdateProfile',  profile )
    .pipe(map(newProfile => {
      // Update the currentUser observable
      this.currentUserSubject.next(newProfile);
      return newProfile;
    }));
  }

}
