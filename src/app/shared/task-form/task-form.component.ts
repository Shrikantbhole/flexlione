import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Task} from '../../article/models/task.model';
import {FormControl, FormGroup} from '@angular/forms';
import {CreateTaskForm} from '../../article/models/TaskForm';
import {DatePipe} from '@angular/common';
import {MessageBoxService} from '../../settings/message-box.service';
import {TaskManagementService} from '../../article/service/task-management-service';
import {ApiError} from '../../settings/api-error.model';
import {getUserList} from '../shared-lists/user-list';
import {getStatusList} from '../shared-lists/status-list';
import {MatSnackBar} from '@angular/material/snack-bar';

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
   @Input()
  set config(task: Task) {
    this.newTask = this.createTaskForm(task);
  }
  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private messageBoxService: MessageBoxService,
    private taskManagementService: TaskManagementService,
    private snackBarService: MatSnackBar,
    private  router: Router
  ) {}

  ngOnInit() {}
  createTaskForm(task: Task): FormGroup {
    const  newTask: FormGroup = CreateTaskForm();
    newTask.controls['taskId'].disable();
    newTask.controls['hrsSpentTillNow'].disable();
    newTask.setValue({
      taskId: task.taskId,
      parentTaskId: task.parentTaskId,
      createdBy: task.createdBy,
      status: task.status == null ? this.StatusList[0] : task.status,
      positionAfter: task.positionAfter,
      description: task.description,
      deadline: task.deadline,
      score: task.score,
      assignedTo: task.assignedTo,
      estimatedHrs: task.taskId,
      hrsSpentTillNow: task.taskId
    });
    return newTask;
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
