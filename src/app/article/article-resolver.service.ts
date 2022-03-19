import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Article, ArticlesService, UserService } from '../core';
import { catchError } from 'rxjs/operators';
import {TaskManagementService} from '../tasks-hierarchy/task-management-service';

@Injectable()
export class ArticleResolver implements Resolve<Article> {
  constructor(
    private articlesService: ArticlesService,
    private router: Router,
    private userService: UserService,
    private taskManagementService: TaskManagementService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {

    return this.taskManagementService.getTaskList(null, 'children').
    pipe(catchError((err) => this.router.navigateByUrl('/')));
  }
}
