import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Article, ArticlesService, UserService } from '../core';
import { catchError } from 'rxjs/operators';
import {TaskManagementService} from '../Services/task-management-service';
import {TaskMaster} from '../core/models/master.model';

@Injectable()
export class TasksMasterResolverService implements Resolve<TaskMaster> {
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

    return this.taskManagementService.getTaskById('0', 'children').
    pipe(catchError((err) => this.router.navigateByUrl('/')));
  }
}
