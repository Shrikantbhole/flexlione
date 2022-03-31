import {Component, Input, OnInit} from '@angular/core';

import { Article, ArticleListConfig, ArticlesService } from '../../core';
import {Task} from '../../article/models/task.model';
import {SearchTaskViewModel} from '../store/interfaces/search-task-view.model';
import {ApiError} from '../../settings/api-error.model';
import { MessageBoxService } from '../../settings/message-box.service';

import {TaskManagementService} from '../../article/service/task-management-service';
import {SearchManagementService} from '../../home/Search/search-management.service';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import * as TaskActions from '../store/search-task.action';
@Component({
  selector: 'app-article-list',
  styleUrls: ['article-list.component.css'],
  templateUrl: './article-list.component.html'
})
export class ArticleListComponent implements OnInit {
  searchTaskViewModel: Observable<SearchTaskViewModel[]>;
  results: Observable<SearchTaskViewModel[]>;
  constructor (
    private articlesService: ArticlesService,
    private taskManagementService: TaskManagementService,
    private messageBoxService: MessageBoxService,
    private searchManagementService: SearchManagementService,
    private store: Store<AppState>
  ) {
    this.results = store.select('searchTaskView');
  }

  @Input() limit: number;
  @Input()
  set config(config: ArticleListConfig) {
    this.runQuery();
  }
  loading = false;
  currentPage = 1;
  totalPages: Array<number> = [1];

  setPageTo(pageNumber) {
    this.currentPage = pageNumber;
    this.runQuery();
  }

  runQuery() {
    console.log('hi');
  }

  ngOnInit(): void {
    this.results = this.store.select('searchTaskView');
  }
}
