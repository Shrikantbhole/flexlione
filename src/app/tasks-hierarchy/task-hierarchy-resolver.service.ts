import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Article, ArticlesService, UserService } from '../core';
import {catchError, map} from 'rxjs/operators';
import {TaskManagementService} from '../article/service/task-management-service';
import { User } from '../core/models';
import {MessageBoxService} from '../settings/message-box.service';

@Injectable()
export class TaskHierarchyResolverService implements Resolve<Article> {
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
    return this.taskManagementService.getTaskById('0', 'children')
      .pipe(
        map(
          article => {
            if (this.userService.getCurrentUser().username !== undefined) {
              return article;
            } else {
              // this.router.navigateByUrl('/login');
              return article;
            }
          }
        ),
        catchError((err) => this.router.navigateByUrl('/'))
      );
  }

}
