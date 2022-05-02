import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import {Profile, ProfilesService, UserService} from '../core';
import {catchError, map} from 'rxjs/operators';
import {TaskModel} from '../article/models/task-detail.model';
import {ApiError} from '../settings/api-error.model';
import { MessageBoxService } from '../settings/message-box.service';

import {TaskManagementService} from '../Services/task-management-service';
import {SearchQuery} from '../home/models/search-query-form.model';
import {SearchManagementService} from '../Services/search-management.service';
import {ProfileManagementService} from '../Services/profile-management.service';

@Injectable()
export class ProfileResolver implements Resolve<Profile> {
  results: TaskModel[];
  constructor(
    private profilesService: ProfilesService,
    private router: Router,
    private userService: UserService,
    private searchManagementService: SearchManagementService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {

    const search = new SearchQuery();
    search.AssignedTo = [route.params['username']];
    return this.searchManagementService.getTaskSearchList(search)
      .pipe(
        map(
          article => {
            if (this.userService.getCurrentUser().name !== undefined) {
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
