import {AfterViewInit, Component, Input, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskModel} from '../../article/models/task-detail.model';
import {FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {MessageBoxService} from '../../settings/message-box.service';
import {TaskManagementService} from '../../Services/task-management-service';
import {ApiError} from '../../settings/api-error.model';
import {getStatusList} from '../shared-lists/status-list';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import {ProfileManagementService} from '../../Services/profile-management.service';
import {ProfileStoreModel} from '../store/interfaces/profile-store.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['../../article/article.component.css']
})
export class TaskFormComponent implements OnChanges, AfterViewInit, OnInit {
   UserList: string[] = []; // get From Api
   StatusList: string[] = getStatusList(); // Hard coded
   @Input() parentForm; // Fetch preloaded details in the form
   Profiles: ProfileStoreModel[] = [];
  public taskIdListForPosition: {'taskId': string, 'description': string}[];
  public taskIdListForParent: {'taskId': string, 'description': string}[];
  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private messageBoxService: MessageBoxService,
    private taskManagementService: TaskManagementService,
    private snackBarService: MatSnackBar,
    private  router: Router,
    private store: Store<AppState>,
    private profileManagementService: ProfileManagementService
  ) {}

  ngOnChanges() {

    this.parentForm.controls['hrsSpentTillNow'].disable();
    this.parentForm.controls['createdAt'].disable();
    this.parentForm.controls['createdAt'].setValue(new Date());
    this.parentForm.controls['taskId'].setValue('Server-Generated');
    this.parentForm.controls['taskId'].disable();
  }
  async ngAfterViewInit() {
      this.taskManagementService.getTaskIdList('', this.getTaskIdListForParent);
    this.taskManagementService.getTaskIdList(this.parentForm.getRawValue().parentTaskId, this.getTaskIdListForPosition);
    // await func will stop code at this point and carry forward only when function is resolved
   this.Profiles = await this.profileManagementService.getAllProfiles().toPromise();
    this.parentForm.controls['assignedTo'].setValue( await this.GetProfileName(
     this.parentForm.getRawValue().assignedTo));
     this.parentForm.controls['createdBy'].setValue(await this.GetProfileName(
     this.parentForm.getRawValue().createdBy));
    for (let i = 0; i < this.Profiles.length; i++ ) {
      this.UserList.push(this.Profiles[i].name);
    }
  }

  getTaskIdListForParent = (taskIdList: {'taskId': string, 'description': string}[]) => { // Assigning parent task id from all existing task
    this.taskIdListForParent = taskIdList;
  }
  getTaskIdListForPosition = (taskIdList: {'taskId': string, 'description': string}[]) => { // Assigning position after task id from all sibling tasks
    this.taskIdListForPosition = taskIdList;
  }

 async ngOnInit() {
   const profiles = await this.profileManagementService.getAllProfiles().toPromise();
   for (let i = 0; i < profiles.length; i++ ) {
     this.UserList.push(profiles[i].name);
   }
   this.parentForm.controls['assignedTo'].setValue( await this.GetProfileName(
     this.parentForm.getRawValue().assignedTo));
   this.parentForm.controls['createdBy'].setValue(await this.GetProfileName(
     this.parentForm.getRawValue().createdBy));
   this.parentForm.controls['hrsSpentTillNow'].disable();
   this.parentForm.controls['createdAt'].setValue(new Date());
   this.parentForm.controls['createdAt'].disable();
  }


  async onClick() {
    this.taskManagementService.createOrUpdateTask(await this.createTask(this.parentForm))
      .subscribe({
        next: (task) => {
          console.log(task);
          this.snackBarService.open('Success. Task has been updated.', '', {duration: 3000});
          this.router.navigateByUrl('/article/' + task.taskId);
        },
        error: (apiError: ApiError) => {
          this.messageBoxService.info('Error: Task not updated .', apiError.title, apiError.detail);
        }
      });
  }

   createTask(newTask: FormGroup): TaskModel {
    const task = new TaskModel();
    task.taskId = newTask.getRawValue().taskId;
    task.description = newTask.getRawValue().description;
    task.createdBy = this.Profiles.filter(function (value) {
      return value.name === newTask.getRawValue().createdBy;
    })[0].profileId;
    task.assignedTo = this.Profiles.filter(function (value) {
      return value.name === newTask.getRawValue().assignedTo;
    })[0].profileId;
    task.score = newTask.getRawValue().score;
    task.status = newTask.getRawValue().status === '' ? 'yetToStart' : newTask.getRawValue().status;
    task.parentTaskId = newTask.getRawValue().parentTaskId === '' ? this.parentForm.getRawValue().parentTaskId :
      task.parentTaskId = newTask.getRawValue().parentTaskId;
    task.positionAfter = newTask.getRawValue().positionAfter === '' ? null : newTask.getRawValue().positionAfter;
    task.deadline = this.datePipe.transform(newTask.getRawValue().deadline, 'yyyy-MM-dd');
    task.expectedHours = newTask.getRawValue().expectedHours === '' ? 0 : +newTask.getRawValue().expectedHours;
    task.createdAt = this.datePipe.transform(newTask.getRawValue().createdAt, 'yyyy-MM-dd');
    return task;
  }

  onParentTaskIdChange(taskId: string) {
    this.taskManagementService.getTaskIdList(taskId, this.getTaskIdListForPosition);
    this.parentForm.controls['positionAfter'].setValue('');

  }

  private async GetProfileName(profileId: string): Promise<string> {
    const profiles = await this.profileManagementService.getAllProfiles().toPromise();
    const profile = profiles.filter(function (value) {
            return (value.profileId === profileId);
          });
          return profile[0] === undefined ? profileId : profile[0].name;
  }
}
