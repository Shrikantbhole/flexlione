import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskModel } from '../article/models/task-detail.model';

import {catchError, retry} from 'rxjs/operators';
import {ServerConfigService} from '../settings/server-config.service';
import {HandlerError} from '../settings/handle-error.service';
import {CheckListItem} from '../article/models/check-list-item.model';

// export keyword is same as public keyword in C# and Java. If export keyword is used, the class
// can used in other files.

@Injectable()
export class ChecklistManagementService {


  // trailing underscore is a naming convention for private variables of the class.
  private http_: HttpClient;

  private baseUrl: string ;




  constructor(http: HttpClient, serverConfigService: ServerConfigService) { // pass by reference
    this.http_ = http;
    this.baseUrl = serverConfigService.getBaseUrl();
  }
  // Returns an observable for list of Line Items
  getCheckList(taskId: string, include: string): Observable<CheckListItem[]> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };

    const queryStringParams
      = {
      include: include,
      taskId: taskId
    };


    return this.http_.get<CheckListItem[]>(this.baseUrl + '/CheckList/GetCheckList', { params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  deleteCheckListItem(checkListId: string): Observable<void> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };
    const queryStringParams = {
      checkListItemId: checkListId
    };
    return this.http_.delete<void>(this.baseUrl + '/CheckList/DeleteCheckListItem', { params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  createOrUpdateCheckListItem(checkListItem: CheckListItem): Observable<CheckListItem> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json;v=1.0'
    };

    return this.http_.put<CheckListItem>(this.baseUrl + '/CheckList/CreateOrUpdateCheckListItem', checkListItem, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

}
