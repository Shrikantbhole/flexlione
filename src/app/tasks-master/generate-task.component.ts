import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {TaskModel} from '../article/models/taskModel';
import {FormControl, FormGroup} from '@angular/forms';
import {CreateTaskForm} from '../article/models/TaskForm';
import {DatePipe} from '@angular/common';
import {TaskManagementService} from '../article/service/task-management-service';
import {MessageBoxService} from '../settings/message-box.service';
import {ApiError} from '../settings/api-error.model';
import {getUserList} from '../shared/shared-lists/user-list';
import {getStatusList} from '../shared/shared-lists/status-list';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-generate-task',
  templateUrl: './generate-task.component.html',

})

export class GenerateTaskComponent implements OnChanges, OnInit {
  @Input() generatedTask: TaskModel;

  UserList: string[] = getUserList();
  StatusList: string[] = getStatusList();
  deadline: FormControl = new FormControl(new Date());
  newTask: FormGroup;
    constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private messageBoxService: MessageBoxService,
    private taskManagementService: TaskManagementService,
    private snackBarService: MatSnackBar,
    private  router: Router
  ) {
  }
    createTaskForm(task: TaskModel): FormGroup {
      const newTask: FormGroup = CreateTaskForm();
     // newTask.controls['taskId'].disable();
     // newTask.controls['hrsSpentTillNow'].disable();
      newTask.setValue({
        taskId: '',
        parentTaskId: '',
        createdBy: '',
        status: '',
        positionAfter: '',
        description: '',
        deadline: '',
        score: '',
        assignedTo: '',
        estimatedHrs: '',
        hrsSpentTillNow: '',
      });
      return newTask;
    }

  ngOnInit() {}
  onAddTaskClick() {
    this.taskManagementService.addTaskToServer(this.createTask(this.newTask))
      .subscribe({
        next: (task) => {
          console.log(task);
          this.snackBarService.open('Success. Task has been added.', '', { duration: 3000 });
         // this.router.navigateByUrl('/article/' + task.taskId);
        },
        error: (apiError: ApiError) => {
          this.messageBoxService.info('Error: Task not added .', apiError.title, apiError.detail);
        }
      });
  }

  createTask(newTask: FormGroup): TaskModel {
    const task = new TaskModel();
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

  ngOnChanges() {
    this.newTask = this.createTaskForm(this.generatedTask);
  }

}
