import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

import {catchError, retry} from 'rxjs/operators';
import {ServerConfigService} from '../../settings/server-config.service';
import {HandlerError} from '../../settings/handle-error.service';
import {CheckListItem} from '../models/check-list-item.model';
import {Dependency} from '../models/dependency.model';

// export keyword is same as public keyword in C# and Java. If export keyword is used, the class
// can used in other files.

@Injectable()
export class DependencyManagementService {


  // trailing underscore is a naming convention for private variables of the class.
  private http_: HttpClient;
  private baseUrl: string ;




  constructor(http: HttpClient, serverConfigService: ServerConfigService) { // pass by reference
    this.http_ = http;
    this.baseUrl = serverConfigService.getBaseUrl();
  }
  // Returns an observable for list of Line Items
  getDownstreamDependency(taskId: string, include: string): Observable<Dependency[]> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };

    const queryStringParams
      = {
      include: include,
      taskId: taskId
    };


    return this.http_.get<Dependency[]>(this.baseUrl + '/Dependency/GetDownstreamDependenciesByTaskId', { params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  getUpstreamDependency(taskId: string, include: string): Observable<Dependency[]> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };

    const queryStringParams
      = {
      include: include,
      taskId: taskId
    };


    return this.http_.get<Dependency[]>(this.baseUrl + '/Dependency/GetUpstreamDependenciesByTaskId', { params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  deleteDependency(dependencyId: string): Observable<void> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };
    const queryStringParams = {
      dependencyId: dependencyId
    };
    return this.http_.delete<void>(this.baseUrl + '/CheckList/DeleteCheckListItem', { params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  createOrUpdateDependency(dependency: Dependency): Observable<Dependency> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json;v=1.0'
    };

    return this.http_.put<Dependency>(this.baseUrl + '/Dependency/CreateOrUpdateDependency', dependency, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

}
