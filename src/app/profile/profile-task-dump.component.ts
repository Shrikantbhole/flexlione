import {Component, Input, OnInit} from '@angular/core';
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
export class ProfileTaskDumpComponent implements OnInit {
  results: SearchTaskViewStoreModel[];
  @Input() options: string[] ;
  @Input() profileId: string ;
  taskId = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private  snackBarService: MatSnackBar,
    private profileComponent: ProfileComponent,
    private taskManagementService: TaskManagementService
  ) {}
  ngOnInit() {
    const profileId = this.profileId;
    this.store.select('searchTaskView')
      .subscribe({
        next: (SearchTaskView) => {
          this.results = SearchTaskView.filter(function (value){
            return  value.assignedTo === profileId;
          });
        }
      });
  }

  public onRowClick(taskId: string) {
    this.taskId = taskId;
  }
  private _filter(value: string) {
    console.log('Hi');
    console.log(value);
  }
   onSuccess = (task: TaskModel)  => {
    this.snackBarService.open('Task Successfully linked to sprint', '', {duration: 300});
  }
  addTaskToSprint(sprintId: string) {
  this.taskManagementService.onLinkTaskToSprint(sprintId, this.taskId, this.onSuccess);
  }



}
