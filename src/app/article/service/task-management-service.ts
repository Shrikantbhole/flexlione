import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskModel } from '../models/taskModel';
import {catchError, retry} from 'rxjs/operators';
import {ServerConfigService} from '../../settings/server-config.service';
import {HandlerError} from '../../settings/handle-error.service';
import {Template} from '../models/template.model';
import {MessageBoxService} from '../../settings/message-box.service';
import {ApiError} from '../../settings/api-error.model';


// import {ApiError} from '../../settings/api-error.model';
// import {MessageBoxService} from '../../settings/message-box.service';


// export keyword is same as public keyword in C# and Java. If export keyword is used, the class
// can used in other files.

@Injectable()
export class TaskManagementService {


  // trailing underscore is a naming convention for private variables of the class.
  private http_: HttpClient;

  private baseUrl: string ;
   constructor(http: HttpClient, serverConfigService: ServerConfigService, private messageBoxService: MessageBoxService) { // pass by reference
    this.http_ = http;
    this.baseUrl = serverConfigService.getBaseUrl();

  }
  // Returns an observable for list of Line Items
  getTaskById(taskId: string, include: string): Observable<TaskModel> {

    const httpHeaders = {
      'Content-Type': 'application/json',
       'accept': 'application/json;v=1.0'
    };

    let queryStringParams;
    queryStringParams = {
        include: include,
        taskId: taskId
    };
    return this.http_.get<TaskModel>(this.baseUrl + '/Task/GetTaskById', { params: queryStringParams, headers: httpHeaders })
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
    return this.http_.delete<void>(this.baseUrl + '/Task/DeleteTask', { params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  createOrUpdateTask(task: TaskModel): Observable<TaskModel> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json;v=1.0'
    };

    return this.http_.put<TaskModel>(this.baseUrl + '/Task/CreateOrUpdateTask', task, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  getAllTemplates( ) {
    const httpHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json;v=1.0'
    };
    return this.http_.get<Template[]>(this.baseUrl + '/Template/GetAllTemplates');
    }

  getTemplateById( templateId: string, include: string) {

    const httpHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json;v=1.0'
    };


    let queryStringParams;
    if (templateId == null) {
      queryStringParams = {
        include: include
      };
    } else {
      queryStringParams = {
        include: include,
        templateId: templateId
      };
    }

    return this.http_.get<Template>(this.baseUrl + '/Template/GetTemplateById', {params: queryStringParams});

  }

  addTaskToTemplate(taskIdList: string [], templateId: string, callback: (task: TaskModel) => any ) {
    const httpHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json;v=1.0'
    };
     let queryStringParams;
        queryStringParams = {
       taskIdList: taskIdList,
          templateId: templateId
        };
     return this.http_.post<TaskModel>(this.baseUrl + '/Template/AddTaskListToTemplate', '', {params: queryStringParams, headers: httpHeaders})
  .pipe(
      retry(1),
      catchError(HandlerError.handleError)
    ).subscribe({
         next : (task) => {
           callback(task);
         },
            error : (apiError: ApiError) => {
        this.messageBoxService.info('Error in adding Task', apiError.title, apiError.detail);
      }
    });
   }

  removeTaskFromTemplate(taskIdList: string [], templateId: String, callback: (task: TaskModel) => any) {
    const httpHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json;v=1.0'
    };
    let queryStringParams;
    queryStringParams = {
      taskIdList: taskIdList,
      templateId: templateId,
    };
    return this.http_.post<TaskModel>(this.baseUrl + '/Template/RemoveTaskListToTemplate', '', { params: queryStringParams, headers: httpHeaders})
  .pipe(
      retry(1),
      catchError(HandlerError.handleError)
    ).subscribe({
      next : (task) => {
        callback(task);
      },
      error : (apiError: ApiError) => {
        this.messageBoxService.info('Error in removing Task', apiError.title, apiError.detail);
      }
    });
   }

  removeTaskFromSprint(taskId: string, callback: (task: TaskModel) => any) {

    const httpHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json;v=1.0'
    };
    const queryStringParams = {
      taskId: taskId
    };

    return this.http_.put<TaskModel>(this.baseUrl + '/Task/RemoveTaskFromSprint', '', {params: queryStringParams, headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      ).subscribe({
        next : (task) => {
          callback(task);
        },
        error : (apiError: ApiError) => {
          this.messageBoxService.info('Error in removing Task', apiError.title, apiError.detail);
        }
      });
  }

  onLinkTaskToSprint(sprintId: string, taskId: string, callback: (task: TaskModel) => any) {
    this.linkTaskToSprint(sprintId, taskId)
      .subscribe({
        next: (task) => {
          callback(task);

        },
        error: (apiError: ApiError) => {
          this.messageBoxService.info('Error in linking taks', apiError.title, apiError.detail);
        }
      });
  }

  linkTaskToSprint(sprintId: string, taskId: string): Observable<TaskModel> {

    const httpHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json;v=1.0'
    };
    const queryStringParams = {
      sprintId: sprintId,
      taskId: taskId
    };

    return this.http_.put<TaskModel>(this.baseUrl + '/Task/LinkTaskToSprint', '', {params: queryStringParams, headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

}


