import { HttpClient, HttpParams } from '@angular/common/http';
import {Injectable, ViewChild} from '@angular/core';
import { Observable } from 'rxjs';
import { TaskModel } from '../article/models/task-detail.model';
import {catchError, retry} from 'rxjs/operators';
import {ServerConfigService} from '../settings/server-config.service';
import {HandlerError} from '../settings/handle-error.service';
import { SearchQuery} from '../home/models/search-query-form.model';
import {SearchTag} from '../home/models/searchTag';
import {SearchTaskViewStoreModel} from '../shared/store/interfaces/search-task-view-store.model';
import {DatePipe} from '@angular/common';
import {MatAccordion} from '@angular/material/expansion';
import {TaskSummaryModel} from '../profile/models/task-summary.model';

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

  constructor(http: HttpClient, serverConfigService: ServerConfigService, datepipe: DatePipe) { // pass by reference
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
