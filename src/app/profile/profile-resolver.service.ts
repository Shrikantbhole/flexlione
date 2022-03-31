import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Profile, ProfilesService } from '../core';
import { catchError } from 'rxjs/operators';
import {Task} from '../article/models/task.model';
import {ApiError} from '../settings/api-error.model';
import { MessageBoxService } from '../settings/message-box.service';

import {TaskManagementService} from '../article/service/task-management-service';

@Injectable()
export class ProfileResolver implements Resolve<Profile> {
  results: Task[];
  constructor(
    private profilesService: ProfilesService,
    private router: Router,
    private taskManagementService: TaskManagementService,
    private messageBoxService: MessageBoxService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {

    return this.taskManagementService.getTaskById('0', 'children').
      pipe(catchError((err) => this.router.navigateByUrl('/')));


  }
}
