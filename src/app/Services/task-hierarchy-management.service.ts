import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskModel } from '../article/models/task-detail.model';
import {catchError, retry} from 'rxjs/operators';

import {ServerConfigService} from '../settings/server-config.service';
import {HandlerError} from '../settings/handle-error.service';
import {ApiError} from '../settings/api-error.model';
import {MessageBoxService} from '../settings/message-box.service';
import {Template} from '../article/models/template.model';
import {TaskHierarchyModel} from '../article/models/task-hierarchy.model';
import {MatSnackBar} from '@angular/material/snack-bar';




// export keyword is same as public keyword in C# and Java. If export keyword is used, the class
// can used in other files.

@Injectable()
export class TaskHierarchyManagementService {


  // trailing underscore is a naming convention for private variables of the class.
  private http_: HttpClient;

  private baseUrl: string;
  // public url = '../../template-tasks/templateData.json';
  public url = 'http://localhost:3000/posts';
  public url1 = 'http://localhost:3000/written';


  constructor(http: HttpClient, serverConfigService: ServerConfigService, private messageBoxService:
    MessageBoxService, private snackBarService: MatSnackBar) { // pass by reference
    this.http_ = http;
    this.baseUrl = serverConfigService.getBaseUrl();

  }

  // Returns an observable for list of Line Items
  getTaskHierarchyByTaskId(taskId: string, include: string, callback: (taskHierarchy: TaskHierarchyModel) => any): any {

    const httpHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json;v=1.0'
    };

    let queryStringParams;
    queryStringParams = {
      include: include,
      taskId: taskId
    };
    this.http_.get<TaskHierarchyModel>(this.baseUrl + '/TaskHierarchy/GetTaskHierarchyByTaskId', {params: queryStringParams, headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      ).subscribe({
        next: (taskHierarchy) => {
          return callback(taskHierarchy);
        },
        error: (apiError: ApiError) => {this.messageBoxService.info('Error in receiving Task Hierarchy', apiError.title, apiError.detail);
        }
      });
  }
}
