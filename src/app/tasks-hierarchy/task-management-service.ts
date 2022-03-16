import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from './models/task.model';
import {catchError, retry} from 'rxjs/operators';
import {ServerConfigService} from './../settings/server-config.service';
import {HandlerError} from './../settings/handle-error.service';

// export keyword is same as public keyword in C# and Java. If export keyword is used, the class
// can used in other files.

@Injectable()
export class TaskManagementService {


  // trailing underscore is a naming convention for private variables of the class.
  private http_: HttpClient;

  private baseUrl: string ;




  constructor(http: HttpClient, serverConfigService: ServerConfigService) { // pass by reference
    this.http_ = http;
    this.baseUrl = serverConfigService.getBaseUrl();
  }
  // Returns an observable for list of Line Items
  getTaskList(taskId: string, include: string): Observable<Task[]> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };

    let queryStringParams;
    if (taskId == null) {
      queryStringParams = {
        include: include
      };
    } else {
      queryStringParams = {
        include: include,
        taskId: taskId
      };
    }



    return this.http_.get<Task[]>(this.baseUrl + '/GetTaskList', { params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  deleteTask(taskId: string): Observable<void> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };
    const queryStringParams = {
      taskId: taskId
    };
    return this.http_.delete<void>(this.baseUrl + '/DeleteTask', { params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  createOrUpdateTask(task: Task): Observable<Task> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json;v=1.0'
    };

    return this.http_.put<Task>(this.baseUrl + '/CreateOrUpdateTask', task, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

}
