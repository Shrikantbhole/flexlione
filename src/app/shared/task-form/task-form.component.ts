import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskModel} from '../../article/models/task-detail.model';
import {FormControl, FormGroup} from '@angular/forms';
import {CreateTaskForm} from '../../article/models/task-detail.form';
import {DatePipe} from '@angular/common';
import {MessageBoxService} from '../../settings/message-box.service';
import {TaskManagementService} from '../../Services/task-management-service';
import {ApiError} from '../../settings/api-error.model';
import {getUserList} from '../shared-lists/user-list';
import {getStatusList} from '../shared-lists/status-list';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import {ProfileStoreModel} from '../store/interfaces/profile-store.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['../../article/article.component.css']
})
export class TaskFormComponent implements OnInit {
   UserList: string[] = getUserList();
   StatusList: string[] = getStatusList();
   deadline: FormControl = new FormControl(new Date());
   newTask: FormGroup;
   private Profiles: ProfileStoreModel[] = [];
   @Input() parentForm; // Fetch preloaded details in the form
  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private messageBoxService: MessageBoxService,
    private taskManagementService: TaskManagementService,
    private snackBarService: MatSnackBar,
    private  router: Router,
    private store: Store<AppState>,
  ) {
    this.store.select('profile')
      .subscribe({ next: (profiles) => {
          this.Profiles = profiles;
        },
        error: () => {}
      });
  }

  ngOnInit() {
    this.parentForm.controls['assignedTo'].setValue(this.GetProfileName(
      this.parentForm.getRawValue().assignedTo));
    this.parentForm.controls['createdBy'].setValue(this.GetProfileName(
      this.parentForm.getRawValue().createdBy));
  }

  onClick() {
  this.taskManagementService.createOrUpdateTask(this.createTask(this.parentForm))
    .subscribe({
      next: (task) => {
        console.log(task);
        this.snackBarService.open('Success. TaskModel has been updated.', '', { duration: 3000 });
        this.router.navigateByUrl('/article/' + task.taskId);
      },
      error: (apiError: ApiError) => {
        this.messageBoxService.info('Error: TaskModel not updated .', apiError.title, apiError.detail);
      }
    });
  }

  createTask(newTask: FormGroup): TaskModel {
    const task = new TaskModel();
    task.taskId = newTask.getRawValue().taskId;
    task.description = newTask.getRawValue().description;
    task.createdBy = this.GetProfileId(newTask.getRawValue().createdBy);
    task.assignedTo = this.GetProfileId(newTask.getRawValue().assignedTo);
    task.score = newTask.getRawValue().score;
    task.status = newTask.getRawValue().status === '' ? 'yetToStart' : newTask.getRawValue().status;
    task.parentTaskId = newTask.getRawValue().parentTaskId;
    task.positionAfter = newTask.getRawValue().positionAfter === '' ? null : newTask.getRawValue().positionAfter;
    task.deadline = this.datePipe.transform(newTask.getRawValue().deadline, 'yyyy-MM-dd');
    return task;
  }

  private GetProfileName(profileId: string): string {
    const profile = this.Profiles.filter(function (value) {
      return (value.profileId === profileId);
    });
    return profile[0] === undefined ? profileId : profile[0].name;
  }
  private GetProfileId(profileName: string): string {
    const profile = this.Profiles.filter(function (value) {
      return (value.name === profileName);
    });
    return profile[0] === undefined ? profileName : profile[0].profileId;
  }

}
