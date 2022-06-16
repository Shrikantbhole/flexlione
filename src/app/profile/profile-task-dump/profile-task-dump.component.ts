import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Observable} from 'rxjs';
import {SearchTaskViewStoreModel} from '../../shared/store/interfaces/search-task-view-store.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProfileComponent} from '../profile.component';
import {TaskManagementService} from '../../Services/task-management-service';
import {TaskModel} from '../../article/models/task-detail.model';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddOrEditScheduleDialogComponent} from '../schedule/add-or-edit-schedule-dialog.component';
import {TaskScheduleModel} from '../models/task-schedule.model';
import {TaskScheduleManagementService} from '../../Services/task-schedule-management.service';
import {SearchQuery} from '../../home/models/search-query-form.model';
import {catchError, map} from 'rxjs/operators';
import {SearchManagementService} from '../../Services/search-management.service';

@Component({
  selector: 'app-profile-task-dump',
  templateUrl: './profile-task-dump.component.html'
})
export class ProfileTaskDumpComponent implements AfterViewInit {
  results: SearchTaskViewStoreModel[];
  sortedResult: SearchTaskViewStoreModel[];
  @Input() options: string[] ;
  @Input()
  set profile(profileId: string) {
    const search = new SearchQuery();
    search.AssignedTo = [profileId];
     this.searchManagementService.getTaskSearchList(search).subscribe({
      next : (taskList) => {this.sortedResult = taskList.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()); },
      error : () => {}
    });

  }
  taskId = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private  snackBarService: MatSnackBar,
    private profileComponent: ProfileComponent,
    private taskManagementService: TaskManagementService,
    private searchManagementService: SearchManagementService
  ) {}
  public onRowClick(taskId: string) {
    this.taskId = taskId;
  }
  onSuccess = (task: TaskModel)  => {
    this.snackBarService.open('Task Successfully linked to sprint', '', {duration: 300});
  }
  addTaskToSprint(sprintId: string) {
  this.taskManagementService.onLinkTaskToSprint(sprintId, this.taskId, this.onSuccess);
  }

  ngAfterViewInit(): void {
  }

  addScheduleToCalender(taskSchedule: TaskScheduleModel) {}
}
