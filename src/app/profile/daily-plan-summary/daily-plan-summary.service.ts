import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../article/models/task.model';
import {catchError, retry} from 'rxjs/operators';
import {ServerConfigService} from '../../settings/server-config.service';
import {HandlerError} from '../../settings/handle-error.service';
import { SearchQuery} from '../models/searchQuery.model';
import {SearchTag} from '../models/searchTag';
import {SearchTaskViewModel} from '../../shared/store/interfaces/search-task-view.model';
import {DatePipe} from '@angular/common';

// export keyword is same as public keyword in C# and Java. If export keyword is used, the class
// can used in other files.

@Injectable()
export class SearchManagementService {

  // trailing underscore is a naming convention for private variables of the class.
  private http_: HttpClient;
  private baseUrl: string ;
  private taskList: Task[];
  private datepipe: DatePipe;

  constructor(http: HttpClient, serverConfigService: ServerConfigService, datepipe: DatePipe) { // pass by reference
    this.http_ = http;
    this.baseUrl = serverConfigService.getBaseUrl();
    this.datepipe = datepipe;
  }
  // Returns an observable for list of Task Search Line Items
  getTaskSearchList(search: SearchQuery): Observable<SearchTaskViewModel[]> {

    const httpHeaders = {
      'Content-Type': 'application/json',
       'accept': 'application/json'
    };
    return this.http_.post<SearchTaskViewModel[]>(this.baseUrl + '/Search/GetSearchResult', search, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(HandlerError.handleError)
      );
  }

  // Returns an observable for list of Task Search Line Items
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
   query.Tag = 'castor';
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
