import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import {Profile, ProfilesService, UserService} from '../core';
import {catchError, map, take} from 'rxjs/operators';
import {TaskModel} from '../article/models/task-detail.model';
import {ApiError} from '../settings/api-error.model';
import { MessageBoxService } from '../settings/message-box.service';

import {TaskManagementService} from '../Services/task-management-service';
import {SearchQuery} from '../home/models/search-query-form.model';
import {SearchManagementService} from '../Services/search-management.service';
import {ProfileManagementService} from '../Services/profile-management.service';

@Injectable()
export class ProfileResolver implements Resolve<boolean> {

  constructor(
    private profilesService: ProfilesService,
    private router: Router,
    private userService: UserService,
    private searchManagementService: SearchManagementService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    return this.userService.isAuthenticated.pipe(take(1));
  }
}
