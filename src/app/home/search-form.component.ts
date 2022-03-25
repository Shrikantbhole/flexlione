import {Component,  Output, EventEmitter } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {CreateSearchForm, GetUserList, SearchQuery} from './models/searchQuery.model';
import {Task} from '../tasks-hierarchy/models/task.model';
import {SearchManagementService} from './search-management.service';
import {ApiError} from '../settings/api-error.model';
import {MessageBoxService} from '../settings/message-box.service';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import * as TaskActions from '../home/store/task.action';
import {DatePipe} from '@angular/common';


/** @title Form field appearance variants */
@Component({
  selector: 'app-home-search-form',
  templateUrl: './search-form.component.html',
})
export class SearchFormComponent {

 //  FilteredOptions is Observable array created for Auto filling
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  UserList: string[] = GetUserList();
  newSearch: FormGroup = CreateSearchForm();
  constructor(
    private searchManagementService: SearchManagementService,
    private  messageBoxService: MessageBoxService,
    private store: Store<AppState>,
    private datePipe: DatePipe
  ) {
    this.getTagList();
  }
  onSearch() {
    console.log(this.createSearch(this.newSearch));
    // Get Search result for search query
    this.searchManagementService.getTaskSearchList(this.createSearch(this.newSearch))
      .subscribe({
        next: (taskList) => {
          console.log(taskList);
          this.store.dispatch(new TaskActions.RemoveTask());
          for ( let i = 0; i < taskList.length; i++) {
            // Add Search result in Store
            this.store.dispatch(new TaskActions.AddTask(taskList[i]));
          }
          },
        error: (apiError: ApiError) => {
          this.messageBoxService.info('Error: Task not updated .', apiError.title, apiError.detail);
        }
      });
  }

  getTagList() {
    this.searchManagementService.getTagList()
      .subscribe({
        next: (tagList) => {
          console.log(tagList);
          for (let i = 0; i < tagList.length; i++) {
            this.options.push(tagList[i].description);
          }
          this.filteredOptions = this.newSearch.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),
          );
          },
        error: (apiError: ApiError) => {
          this.messageBoxService.info('Error: Task not updated .', apiError.title, apiError.detail);
        }
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private createSearch(newSearch: FormGroup): SearchQuery {
    const search = new SearchQuery();
    search.Tag = newSearch.getRawValue().tag;
    if (newSearch.getRawValue().createdBy !== '') {
      search.CreatedBy = [newSearch.getRawValue().createdBy];
    }
    if (newSearch.getRawValue().deadline !== '') {
      search.Deadline = this.datePipe.transform(newSearch.getRawValue().deadline, 'yyyy-MM-dd');
    }
    return search;
  }


}
