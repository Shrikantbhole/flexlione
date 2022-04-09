import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {CreateSearchForm, GetUserList, SearchQuery} from '../models/search-query-form.model';
import {Task} from '../../article/models/task.model';
import {SearchManagementService} from './search-management.service';
import {ApiError} from '../../settings/api-error.model';
import {MessageBoxService} from '../../settings/message-box.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import * as TaskActions from '../../shared/store/search-task.action';
import {DatePipe} from '@angular/common';
import {getStatusList} from '../../shared/shared-lists/status-list';
import {getUserList} from '../../shared/shared-lists/user-list';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';

/** @title Form field appearance variants */
@Component({
  selector: 'app-home-search-form',
  templateUrl: './search-form.component.html',
})
export class SearchFormComponent implements  OnInit {

 //  FilteredOptions is Observable array created for Auto filling
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  public AddTag = '';
  UserList: string[] = getUserList();
  StatusList: string[] = getStatusList();
  newSearch: FormGroup = CreateSearchForm();
  constructor(
    private searchManagementService: SearchManagementService,
    private  messageBoxService: MessageBoxService,
    private store: Store<AppState>,
    private datePipe: DatePipe,
    private  snackBarService: MatSnackBar,
    private route: ActivatedRoute,
  ) {
    this.getTagList();
  }
  getTaskSearchList(search: SearchQuery) {
    this.searchManagementService.getTaskSearchList(search)
      .subscribe({
        next: (taskList) => {
          console.log(taskList);
          this.store.dispatch(new TaskActions.RemoveSearchTask());
          for ( let i = 0; i < taskList.length; i++) {
            // Add Search result in Store
            this.store.dispatch(new TaskActions.AddSearchTask(taskList[i]));
          }
        },
        error: (apiError: ApiError) => {
          this.messageBoxService.info('Error: Task not updated .', apiError.title, apiError.detail);
        }
      });
  }
  onSearch() {
    console.log(this.createSearch(this.newSearch));
    // Get Search result for search query
    this.getTaskSearchList(this.createSearch(this.newSearch));
  }

  getTagList() {
    this.searchManagementService.getTagList()
      .subscribe({
        next: (tagList) => {
          console.log(tagList);
          this.options = [];
          for (let i = 0; i < tagList.length; i++) {
            this.options.push(tagList[i].description);
            console.log(this.options);
          }
          },
        error: (apiError: ApiError) => {
          this.messageBoxService.info('Error: Task not updated .', apiError.title, apiError.detail);
        }
      });
  }

  private _filter(value: string): string[] {
    return this.options.filter(option => option.toLowerCase().includes(
      value === undefined ? '' : value.toLowerCase()
    ));
  }

  private createSearch(newSearch: FormGroup): SearchQuery {
    const search = new SearchQuery();
    search.Tag = newSearch.getRawValue().tag;
    if (newSearch.getRawValue().createdBy !== '' && newSearch.getRawValue().createdBy !== undefined)  {
      search.CreatedBy = [newSearch.getRawValue().createdBy];
    }

    if (newSearch.getRawValue().assignedTo !== '' && newSearch.getRawValue().assignedTo !== undefined) {
      search.AssignedTo = [newSearch.getRawValue().assignedTo];
    }
    if (newSearch.getRawValue().deadline !== '' && newSearch.getRawValue().deadline !== undefined) {
      search.Deadline = this.datePipe.transform(newSearch.getRawValue().deadline, 'yyyy-MM-dd');
    }

    if (newSearch.getRawValue().status !== '' && newSearch.getRawValue().status !== undefined) {
      search.Status = [newSearch.getRawValue().status];
    }
    return search;
  }

  public onAdd() {
    console.log(this.AddTag);
    this.searchManagementService.addTag(this.AddTag).subscribe({
      next: (tag) => {
        console.log(tag);
        this.getTagList();
        this.snackBarService.open('Tag: ' + this.AddTag + ' has been successfully added', '', { duration: 3000 });
        this.AddTag = '';
      },
      error: () => {}
    });
  }
  ngOnInit() {
    this.filteredOptions = this.newSearch.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value.tag)),
    );

    this.route.queryParams.subscribe({
      next: (param) => {
        if ( param !== undefined) {
          console.log(param.search);
          const searchQuery: SearchQuery = new SearchQuery();
          searchQuery.Tag = param.search;
         this.getTaskSearchList(searchQuery);
        }
      },
      error: () => {}
    });
  }

}
