import {Component, Input, OnInit} from '@angular/core';

import { Article, ArticleListConfig, ArticlesService } from '../../core';
import {TaskModel} from '../../article/models/task-detail.model';
import {SearchTaskViewStoreModel} from '../store/interfaces/search-task-view-store.model';
import {ApiError} from '../../settings/api-error.model';
import { MessageBoxService } from '../../settings/message-box.service';

import {TaskManagementService} from '../../Services/task-management-service';
import {SearchManagementService} from '../../Services/search-management.service';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
@Component({
  selector: 'app-article-list',
  styleUrls: ['article-list.component.css'],
  templateUrl: './article-list.component.html'
})
export class ArticleListComponent {
  searchTaskViewModel: Observable<SearchTaskViewStoreModel[]>;
  results: SearchTaskViewStoreModel[];
  loading = false;
  currentPage = 1;
  totalPages: Array<number> = [1];
  @Input() limit: number;
  @Input()
  set config(config: ArticleListConfig) {
    this.runQuery();
  }
  constructor (
    private articlesService: ArticlesService,
    private taskManagementService: TaskManagementService,
    private messageBoxService: MessageBoxService,
    private searchManagementService: SearchManagementService,
    private store: Store<AppState>
  ) {
     store.select('searchTaskView').subscribe(
      {
        next: (results) => {
          this.results = results.sort((a, b) => {
            return this.getTime(new Date(a.deadline)) - this.getTime(new Date(b.deadline));
          });
          },
        error: () => {}
      });
  }

  private getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
  }
  setPageTo(pageNumber) {
    this.currentPage = pageNumber;
    this.runQuery();
  }

  runQuery() {
    console.log('hi');
  }
}
