import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticlesService, CommentsService, UserService} from '../core';
import {ChecklistManagementService} from '../tasks-hierarchy/checklist-management.service';
import {Task} from '../tasks-hierarchy/models/task.model';
import {FormControl, FormGroup} from '@angular/forms';
import {CreateTaskForm} from './models/TaskForm';
import {DatePipe} from '@angular/common';
import {MessageBoxService} from '../settings/message-box.service';
import {TaskManagementService} from '../tasks-hierarchy/task-management-service';
import {ApiError} from '../settings/api-error.model';
import {getUserList} from '../shared/shared-lists/user-list';
import {getStatusList} from '../shared/shared-lists/status-list';
import {SnackBarHarnessFilters} from '@angular/material/snack-bar/testing';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['article.component.css']
})
export class TaskFormComponent implements OnInit {
   UserList: string[] = getUserList();
  StatusList: string[] = getStatusList();
  Status: string = null;
  @Input() task: Task;
  deadline: FormControl = new FormControl(new Date());
  newTask: FormGroup = CreateTaskForm();
  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private messageBoxService: MessageBoxService,
    private taskManagementService: TaskManagementService,
    private snackBarService: MatSnackBar,
    private  router: Router
  ) {
  }

  ngOnInit() {
    this.newTask.controls['taskId'].disable();
    this.newTask.controls['hrsSpentTillNow'].disable();
    this.newTask.setValue({
      taskId: this.task.taskId,
      parentTaskId: this.task.parentTaskId,
      createdBy: this.task.createdBy,
      status: this.task.status == null ? this.StatusList[0] : this.task.status,
      positionAfter: this.task.positionAfter,
      description: this.task.description,
      deadline: this.task.deadline,
      score: this.task.score,
      assignedTo: this.task.assignedTo,
      estimatedHrs: this.task.taskId,
      hrsSpentTillNow: this.task.taskId
    });
  }

  onClick() {
  this.taskManagementService.createOrUpdateTask(this.createTask(this.newTask))
    .subscribe({
      next: (task) => {
        console.log(task);
        this.snackBarService.open('Success. Task has been updated.', '', { duration: 3000 });
        this.router.navigateByUrl('/article/' + task.taskId);
      },
      error: (apiError: ApiError) => {
        this.messageBoxService.info('Error: Task not updated .', apiError.title, apiError.detail);
      }
    });
  }

  createTask(newTask: FormGroup): Task {
    const task = new Task();
    task.taskId = newTask.getRawValue().taskId;
    task.description = newTask.getRawValue().description;
    task.createdBy = newTask.getRawValue().createdBy;
    task.assignedTo = newTask.getRawValue().assignedTo;
    task.score = newTask.getRawValue().score;
    task.status = newTask.getRawValue().status === '' ? 'notYetStarted' : newTask.getRawValue().status;
    task.parentTaskId = newTask.getRawValue().parentTaskId;
    task.positionAfter = newTask.getRawValue().positionAfter === '' ? null : newTask.getRawValue().positionAfter;
    task.deadline = this.datePipe.transform(this.newTask.getRawValue().deadline, 'yyyy-MM-dd');
    return task;
  }

}
