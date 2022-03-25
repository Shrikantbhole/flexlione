import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {ArticleListConfig, TagsService, User, UserService} from '../core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Task} from '../tasks-hierarchy/models/task.model';
import {SearchManagementService} from './search-management.service';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {ApiError} from '../settings/api-error.model';
import {SearchQuery} from './models/searchQuery.model';
import * as TaskActions from './store/task.action';
import {MessageBoxService} from '../settings/message-box.service';
import {setAnalyticsConfig} from '@angular/cli/models/analytics';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() taskList: Task[];
  currentUser: User;
  constructor(
    private router: Router,
    private tagsService: TagsService,
    private userService: UserService,
    private  searchManagementService: SearchManagementService,
    private store: Store<AppState>,
    private  messageBoxService: MessageBoxService,
    public globalSearch: SearchQuery,
    public personalSearch: SearchQuery
  ) {}


  isAuthenticated: boolean;
  listConfig: ArticleListConfig = {
    type: 'all',
    filters: {}
  };
  tags: Array<string> = [];
  ngOnInit() {
    this.globalSearch = this.searchManagementService.getGlobalSearch();
    this.personalSearch = this.searchManagementService.getPersonalSearch();
    this.userService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;

        // set the article list accordingly
        if (authenticated) {
          this.setListTo(this.searchManagementService.getPersonalSearch());
        } else {
          this.setListTo(this.searchManagementService.getGlobalSearch());
        }
      });

    this.userService.currentUser.subscribe(
      (userData) => {
      this.personalSearch.AssignedTo = [userData.username];
      }
    );
  }

  setListTo(query: SearchQuery) {

    this.searchManagementService.getTaskSearchList(query)
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

    // Otherwise, set the list object
    this.listConfig = {type: '', filters: null};
  }
}