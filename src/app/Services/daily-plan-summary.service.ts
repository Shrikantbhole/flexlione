import { HttpClient, HttpParams } from '@angular/common/http';
import {Injectable, ViewChild} from '@angular/core';
import { Observable } from 'rxjs';
import { TaskModel } from '../article/models/task-detail.model';
import {catchError, retry} from 'rxjs/operators';
import {ServerConfigService} from '../settings/server-config.service';
import {HandlerError} from '../settings/handle-error.service';
import {DatePipe} from '@angular/common';
import {MatAccordion} from '@angular/material/expansion';
import {TaskSummaryModel} from '../profile/models/task-summary.model';
import {ApiError} from '../settings/api-error.model';
import {MessageBoxService} from '../settings/message-box.service';
import {MatSnackBar} from '@angular/material/snack-bar';

// export keyword is same as public keyword in C# and Java. If export keyword is used, the class
// can used in other files.

@Injectable()
export class DailyPlanSummaryService {

  // trailing underscore is a naming convention for private variables of the class.
  private http_: HttpClient;
  private baseUrl: string;
  private taskList: TaskModel[];
  private datepipe: DatePipe;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(http: HttpClient, serverConfigService: ServerConfigService,
              datepipe: DatePipe, private messageBoxService: MessageBoxService,
              private snackBarService: MatSnackBar) { // pass by reference
    this.http_ = http;
    this.baseUrl = serverConfigService.getBaseUrl();
    this.datepipe = datepipe;
  }

  // Returns an observable for list of TaskModel Search Line Items
  getTaskSummaryById(taskSummaryId: string): Observable<TaskSummaryModel> {

    const httpHeaders = {
      'Content-Type': 'application/json'
    };
    const queryParams = {
      'taskSummaryId': taskSummaryId
    };
    return this.http_.get<TaskSummaryModel>(this.baseUrl + '/TaskSummary/GetTaskSummaryById', {headers: httpHeaders, params: queryParams})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  getDailyTaskSummary(profileId: string, date: string): Observable<TaskSummaryModel[]> {

    const httpHeaders = {
      'Content-Type': 'application/json'
    };
    const queryParams = {
      'profileId': profileId,
      'date': date
    };
    return this.http_.get<TaskSummaryModel[]>(this.baseUrl + '/TaskSummary/GetDailyTaskSUmmary', {headers: httpHeaders, params: queryParams})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  // Returns an observable for list of TaskModel Search Line Items
  getTaskSummaryByTaskId(taskId: string, include: string, callBack: (TaskSummaryList: TaskSummaryModel[]) => any): any {

    const httpHeaders = {
      'Content-Type': 'application/json'
    };
    const queryParams = {
      'taskId': taskId,
      'include': include
    };
    return this.http_.get<TaskSummaryModel[]>(this.baseUrl + '/TaskSummary//GetAllTaskSummaryByTaskId', {headers: httpHeaders, params: queryParams})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      ).subscribe({
        next: (TaskSummaryList) => {
          // this.snackBarService.open('Task Summary successfully retrieved', ' ', {duration: 3000});
          callBack(TaskSummaryList);
        },
        error: (apiError: ApiError) => {this.messageBoxService.info('Error in retrieving Task Summary', apiError.title, apiError.detail); }
      });
  }

  // Returns an observable for list of TaskModel Search Line Items
  updateTaskSummary(taskSummary: TaskSummaryModel): Observable<TaskSummaryModel> {

    const httpHeaders = {
      'Content-Type': 'application/json'
    };

    return this.http_.post<TaskSummaryModel>(this.baseUrl + '/TaskSummary/AddOrUpdateTaskSummary', taskSummary , {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }


}
