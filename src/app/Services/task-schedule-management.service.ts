import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';


import {catchError, retry} from 'rxjs/operators';
import {ServerConfigService} from '../settings/server-config.service';
import {HandlerError} from '../settings/handle-error.service';
import {ProfileModel} from '../profile/models/profile.model';
import {ProfileStoreModel} from '../shared/store/interfaces/profile-store.model';
import {SprintModel} from '../profile/models/sprint.model';
import {TaskScheduleModel} from '../profile/models/task-schedule.model';
import {ApiError} from '../settings/api-error.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MessageBoxService} from '../settings/message-box.service';

// export keyword is same as public keyword in C# and Java. If export keyword is used, the class
// can used in other files.

@Injectable()
export class TaskScheduleManagementService {


  // trailing underscore is a naming convention for private variables of the class.
  private http_: HttpClient;
  private baseUrl: string ;

  // Observable string sources
  private newTaskSchedule = new Subject<TaskScheduleModel>();
  // Observable string streams
  newTaskSchedule$ = this.newTaskSchedule.asObservable();


  constructor(http: HttpClient,
              serverConfigService: ServerConfigService,
              private snackBarService: MatSnackBar,
              private messageBoxService: MessageBoxService) { // pass by reference
    this.http_ = http;
    this.baseUrl = serverConfigService.getBaseUrl();
      }

 AddOrUpdateTaskSchedule(taskSchedule: TaskScheduleModel): Observable<TaskScheduleModel> {

    const httpHeaders = {
      'Content-Type': 'application/json'
    };

    return this.http_.post<TaskScheduleModel>(this.baseUrl + '/TaskSchedule/AddOrUpdateTaskSchedule', taskSchedule, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }
  // emit an event into newTaskSchedule$ Observable Stream
  emitTaskSchedule(taskSchedule: TaskScheduleModel) {
    this.newTaskSchedule.next(taskSchedule);
  }

  getTaskScheduleByProfileId(profileId: string, month: number, year: number): Observable<any> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };

    const queryStringParams
      = {profileId: profileId,
    month: month.toString(),
    year: year.toString()};


    return this.http_.get<TaskScheduleModel[]>(this.baseUrl + '/TaskSchedule/GetTaskScheduleForProfileId', {
      params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  getTaskScheduleById(taskScheduleId: string, include: string =  null): Observable<TaskScheduleModel> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };
    const queryStringParams = {
      taskScheduleId: taskScheduleId,
      include: include
    };
    return this.http_.get<TaskScheduleModel>(this.baseUrl + '/TaskSchedule/GetTaskScheduleById', {
      params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  deleteTaskScheduleById(taskScheduleId: string) {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };
    const queryStringParams = {
      taskScheduleId: taskScheduleId
    };

    return this.http_.delete<void>(this.baseUrl + '/TaskSchedule/DeleteTaskSchedule', {
      params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      ).subscribe({
        next : (any) => {
          this.snackBarService.open('Task Schedule ' + taskScheduleId + ' successfully deleted', '', {duration: 300});
        },
        error : (apiError: ApiError) => {this.messageBoxService.info('Error in deleting Task Schedule ', apiError.title, apiError.detail);
        }
      });
  }





}
