import { Component, Input } from '@angular/core';

import { Article, ArticleListConfig, ArticlesService } from '../../core';
import {Task} from '../../tasks-hierarchy/models/task.model';
import {ApiError} from '../../settings/api-error.model';
import { MessageBoxService } from '../../settings/message-box.service';

import {TaskManagementService} from '../../tasks-hierarchy/task-management-service';
@Component({
  selector: 'app-article-list',
  styleUrls: ['article-list.component.css'],
  templateUrl: './article-list.component.html'
})
export class ArticleListComponent {
  constructor (
    private articlesService: ArticlesService,
    private taskManagementService: TaskManagementService,
    private messageBoxService: MessageBoxService
  ) {}

  @Input() limit: number;
  @Input()
  set config(config: ArticleListConfig) {
    if (config) {
      this.query = config;
      this.currentPage = 1;
      this.runQuery();
    }
  }

  query: ArticleListConfig;
  results: Task[];
  loading = false;
  currentPage = 1;
  totalPages: Array<number> = [1];

  setPageTo(pageNumber) {
    this.currentPage = pageNumber;
    this.runQuery();
  }

  runQuery() {
    this.loading = true;
    this.results = [];

    // Create limit and offset filter (if necessary)
    if (this.limit) {
      this.query.filters.limit = this.limit;
      this.query.filters.offset =  (this.limit * (this.currentPage - 1));
    }
    /*
    this.articlesService.query(this.query)
    .subscribe(data => {
      this.loading = false;
      this.results = data.articles;
      */

    this.taskManagementService.getTaskList(null, 'children').subscribe(
      {
        next: (taskList: Task[]) => {
          console.log(taskList);
          this.results = taskList;

          console.log(this.results);
        },
        error: (apiError: ApiError) => this.messageBoxService.info('Could not start wave', apiError.title, apiError.detail)
      });
  }
}
