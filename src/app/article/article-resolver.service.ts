import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Article, ArticlesService, UserService } from '../core';
import {catchError, map} from 'rxjs/operators';
import {TaskManagementService} from '../tasks-hierarchy/task-management-service';
import { User } from '../core/models';
import {MessageBoxService} from '../settings/message-box.service';

@Injectable()
export class ArticleResolver implements Resolve<Article> {
  constructor(
    private articlesService: ArticlesService,
    private router: Router,
    private userService: UserService,
    private taskManagementService: TaskManagementService,
    private  messageBoxService: MessageBoxService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const user = this.userService.getCurrentUser();
    return this.taskManagementService.getTaskList(null, 'children')
      .pipe(
        map(
          article => {
            if (this.userService.getCurrentUser().username !== undefined) {
              return article;
            } else {
              this.router.navigateByUrl('/login');
            }
          }
        ),
        catchError((err) => this.router.navigateByUrl('/'))
      );
        }

}
