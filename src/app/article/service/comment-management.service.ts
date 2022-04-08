import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

import {catchError, retry} from 'rxjs/operators';
import {ServerConfigService} from '../../settings/server-config.service';
import {HandlerError} from '../../settings/handle-error.service';
import {CheckListItem} from '../models/check-list-item.model';
import {Dependency} from '../models/dependency.model';
import {TaskComment} from '../models/task-comment.model';

// export keyword is same as public keyword in C# and Java. If export keyword is used, the class
// can used in other files.

@Injectable()
export class CommentManagementService {


  // trailing underscore is a naming convention for private variables of the class.
  private http_: HttpClient;
  private baseUrl: string ;




  constructor(http: HttpClient, serverConfigService: ServerConfigService) { // pass by reference
    this.http_ = http;
    this.baseUrl = serverConfigService.getBaseUrl();
  }
  // Returns an observable for list of Line Items
  getCommentsByTaskId(taskId: string): Observable<TaskComment[]> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };

    const queryStringParams
      = {
      taskId: taskId
    };


    return this.http_.get<TaskComment[]>(this.baseUrl + '/Comment/GetCommentsByTaskId', { params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  deleteComment(commentId: string): Observable<void> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };
    const queryStringParams = {
      commentId: commentId
    };
    return this.http_.delete<void>(this.baseUrl + '/Comment/DeleteComment', { params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  createOrUpdateComment(comment: TaskComment): Observable<TaskComment> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json;v=1.0'
    };

    return this.http_.put<TaskComment>(this.baseUrl + '/Comment/CreateOrUpdateComment', comment, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

}
