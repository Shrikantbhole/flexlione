import {Component, Output, EventEmitter, OnInit, Input} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SearchQueryForm, GetUserList, SearchQuery} from '../models/search-query-form.model';
import {TaskModel} from '../../article/models/task-detail.model';
import {SearchManagementService} from '../../Services/search-management.service';
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
import {ProfileStoreModel} from '../../shared/store/interfaces/profile-store.model';

/** @title Form field appearance variants */
@Component({
  selector: 'app-home-search-form',
  templateUrl: './search-form.component.html',
})
export class SearchFormComponent implements  OnInit {

 //  FilteredOptions is Observable array created for Auto filling
  @Input() form; // this is parent form
  public  options: string[] = [];
  filteredOptions: Observable<string[]>;
  public AddTag = '';
  private Profiles: ProfileStoreModel[] = [];
  UserList: string[] = getUserList();
  StatusList: string[] = getStatusList();
  newSearch: FormGroup = SearchQueryForm();
   initialValue = true;

  constructor(
    private searchManagementService: SearchManagementService,
    private  messageBoxService: MessageBoxService,
    private store: Store<AppState>,
    private datePipe: DatePipe,
    private  snackBarService: MatSnackBar,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.getTagList();
    this.newSearch.controls['includeRemoved'].setValue(true);
  }
  public getTaskSearchList(search: SearchQuery) {
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
          this.messageBoxService.info('Error: TaskModel not updated .', apiError.title, apiError.detail);
        }
      });
  }
  onSearch() {
    // console.log(this.createSearch(this.newSearch));
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
          this.messageBoxService.info('Error: TaskModel not updated .', apiError.title, apiError.detail);
        }
      });
  }

  public _searchByTag(tag: string) {
    const searchQuery: SearchQuery = new SearchQuery();
    searchQuery.Tag = tag;
    this.getTaskSearchList(searchQuery);
  }
  private _filter(value: string): string[] {
    return this.options.filter(option => option.toLowerCase().includes(
      value === undefined ? '' : value.toLowerCase()
    ));
  }

  private createSearch(newSearch: FormGroup): SearchQuery {
    const search = new SearchQuery();
    if (newSearch.getRawValue().description !== '' && newSearch.getRawValue().description !== undefined)  {
      search.Description = newSearch.getRawValue().description;
    }
    if (newSearch.getRawValue().createdBy !== '' && newSearch.getRawValue().createdBy !== undefined)  {
      search.CreatedBy = [this.GetProfileId(newSearch.getRawValue().createdBy)];
    }

    if (newSearch.getRawValue().assignedTo !== '' && newSearch.getRawValue().assignedTo !== undefined) {
      search.AssignedTo = [this.GetProfileId(newSearch.getRawValue().assignedTo)];
    }
    if (newSearch.getRawValue().deadline !== '' && newSearch.getRawValue().deadline !== undefined) {
      search.Deadline = this.datePipe.transform(newSearch.getRawValue().deadline, 'yyyy-MM-dd');
    }

    if (newSearch.getRawValue().status !== '' && newSearch.getRawValue().status !== undefined) {
      search.Status = [newSearch.getRawValue().status];
    }

    if (newSearch.getRawValue().includeRemoved !== '' && newSearch.getRawValue().includeRemoved !== undefined) {
      search.IncludeRemoved = newSearch.getRawValue().includeRemoved;
    }

    if (newSearch.getRawValue().taskId !== '' && newSearch.getRawValue().taskId !== undefined) {
      search.TaskId = newSearch.getRawValue().taskId;
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
    this.store.select('profile')
      .subscribe({
        next: (profiles) => {
          this.Profiles = profiles;
        },
        error: () => {}
      });

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

  public GetProfileId(profileName: string): string {
    const profile = this.Profiles.filter(function (value) {
      return (value.name === profileName);
    });
    return profile[0] === undefined ? profileName : profile[0].profileId;
  }

}
