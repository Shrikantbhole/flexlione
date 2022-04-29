import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {ArticleListConfig, TagsService, User, UserService} from '../core';
import {TaskModel} from '../article/models/task-detail.model';
import {SearchManagementService} from '../Services/search-management.service';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {ApiError} from '../settings/api-error.model';
import {SearchQuery, SearchQueryForm} from './models/search-query-form.model';
import * as TaskActions from '../shared/store/search-task.action';
import {MessageBoxService} from '../settings/message-box.service';
import {ProfileManagementService} from '../Services/profile-management.service';
import {FormGroup} from '@angular/forms';
import {TaskManagementService} from '../Services/task-management-service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() taskList: TaskModel[];
  currentUser: User;
  parentForm: FormGroup = SearchQueryForm();
  constructor(
    private router: Router,
    private tagsService: TagsService,
    private userService: UserService,
    private  searchManagementService: SearchManagementService,
    private store: Store<AppState>,
    private  messageBoxService: MessageBoxService,
    public globalSearch: SearchQuery,
    public personalSearch: SearchQuery
  ) {
  }


  isAuthenticated: boolean;
  listConfig: ArticleListConfig = {
    type: 'all',
    filters: {}
  };
  tags: Array<string> = [];
  ngOnInit() {
    this.globalSearch = this.searchManagementService.getGlobalSearch();
    this.personalSearch = this.searchManagementService.getPersonalSearch();
    this.setListTo(this.searchManagementService.getGlobalSearch());
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
          this.store.dispatch(new TaskActions.RemoveSearchTask());
          for ( let i = 0; i < taskList.length; i++) {
            console.log('Date ' + new Date(taskList[i].deadline).getFullYear());
            // Add Search result in Store
            this.store.dispatch(new TaskActions.AddSearchTask(taskList[i]));
          }
        },
        error: (apiError: ApiError) => {
          this.messageBoxService.info('Error: TaskModel not updated .', apiError.title, apiError.detail);
        }
      });

    // Otherwise, set the list object
     this.listConfig = {type: '', filters: null};
  }


}
