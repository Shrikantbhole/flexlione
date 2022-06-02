import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Observable} from 'rxjs';
import {SearchTaskViewStoreModel} from '../shared/store/interfaces/search-task-view-store.model';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProfileComponent} from './profile.component';
import {TaskManagementService} from '../Services/task-management-service';
import {TaskModel} from '../article/models/task-detail.model';

@Component({
  selector: 'app-profile-task-dump',
  templateUrl: './profile-task-dump.component.html'
})
export class ProfileTaskDumpComponent implements AfterViewInit {
  results: SearchTaskViewStoreModel[];
  sortedResult: SearchTaskViewStoreModel[];
  ProfileId = '';
  @Input() options: string[] ;
  @Input()
  set profile(profileId: string) {
    this.store.select('searchTaskView')
      .subscribe({
        next: (SearchTaskView) => {
          this.results = SearchTaskView.filter(function (value) {
            return  value.assignedTo === profileId;
          });
          this.sortedResult = this.results.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
        }
      });
  }
  taskId = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private  snackBarService: MatSnackBar,
    private profileComponent: ProfileComponent,
    private taskManagementService: TaskManagementService
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



}
