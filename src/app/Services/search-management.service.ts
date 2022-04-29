import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskModel } from '../article/models/task-detail.model';
import {catchError, retry} from 'rxjs/operators';
import {ServerConfigService} from '../settings/server-config.service';
import {HandlerError} from '../settings/handle-error.service';
import { SearchQuery} from '../home/models/search-query-form.model';
import {SearchTag} from '../home/models/searchTag';
import {SearchTaskViewStoreModel} from '../shared/store/interfaces/search-task-view-store.model';
import {DatePipe} from '@angular/common';

// export keyword is same as public keyword in C# and Java. If export keyword is used, the class
// can used in other files.

@Injectable()
export class SearchManagementService {

  // trailing underscore is a naming convention for private variables of the class.
  private http_: HttpClient;
  private baseUrl: string ;
  private taskList: TaskModel[];
  private datepipe: DatePipe;

  constructor(http: HttpClient, serverConfigService: ServerConfigService, datepipe: DatePipe) { // pass by reference
    this.http_ = http;
    this.baseUrl = serverConfigService.getBaseUrl();
    this.datepipe = datepipe;
  }
  // Returns an observable for list of Task Detail Model Items.
  // Angular maps Task Detail model into Search Task Model
  getTaskSearchList(search: SearchQuery): Observable<SearchTaskViewStoreModel[]> {

    const httpHeaders = {
      'Content-Type': 'application/json',
       'accept': 'application/json'
    };
    return this.http_.post<SearchTaskViewStoreModel[]>(this.baseUrl + '/Search/GetSearchResult', search, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  // Returns an observable for list of TaskModel Search Line Items
  getTagList(): Observable<SearchTag[]> {

    const httpHeaders = {
      'Content-Type': 'application/json'
    };
    return this.http_.get<SearchTag[]>(this.baseUrl + '/Search/GetTagList',  {headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  getGlobalSearch(): SearchQuery {
   const query = new SearchQuery();
   query.Deadline = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
   // query.Deadline = this.datepipe.transform(new Date().getDate() + 14, 'yyyy-MM-dd');
    return query;
  }

  getPersonalSearch(): SearchQuery {
    const query = new SearchQuery();
    query.Tag = 'conveyor';
    // query.Deadline = this.datepipe.transform(new Date().getDate() + 14, 'yyyy-MM-dd');

    return query;
  }

  addTag(newTag: string): Observable<any>  {
    const httpHeaders = {
      'Content-Type': 'application/json',
      // 'accept': 'application/json;v=1.0'
    };
    let queryStringParams;
    queryStringParams = {
      tag: newTag
    };
    return this.http_.post<any>(this.baseUrl + '/Search/AddOrUpdateTagWithResult', newTag , {params: queryStringParams, headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }
}
