import {Component, Inject, Input, OnChanges, OnInit} from '@angular/core';
import {Task} from '../article/models/task.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CreateTaskForm} from '../article/models/TaskForm';
import {DatePipe} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TaskManagementService} from '../article/service/task-management-service';
import {MessageBoxService} from '../settings/message-box.service';
import {ApiError} from '../settings/api-error.model';

@Component({
  selector: 'app-generate-task',
  templateUrl: './generate-task.component.html',

})

export class GenerateTaskComponent implements OnChanges, OnInit {

  @Input() gTask: Task;

  public Tasks: Task[] = [];
  public selectedTask = '';
  public UserList: string[] = ['Chirag', 'Venkatesh', 'Birendra', 'Akash',
    'Tejesh', 'Anuj', 'Sundeep', 'Raja', 'Shrikant', 'Nimmit'];
  public CreatedBy = '';
  public AssignedTo = '';
  public StatusList: string[] = ['yetToStart', 'ongoing', 'onHold', 'completed', 'dropped'];
  public SelectedStatus = '';
  public isEdit: boolean ;
  // members for data-binding
  newTask: FormGroup = new FormGroup({
    taskId: new FormControl('', [Validators.required]),
    'parentTaskId': new FormControl(''),
    'createdBy': new FormControl(''),
    'status': new FormControl(''),
    'positionAfter': new FormControl(''),
    'description': new FormControl(''),
    'deadline': new FormControl(''),
    'assignedTo': new FormControl(''),
    'score': new FormControl('')

  });

  // FormControl to track value of Deadline
  deadline: FormControl = new FormControl(new Date());
  // Track event change in a dare field
  public dateEvent = '';
  // Transform from one format to another
  public  Datepipe: DatePipe;

  constructor  (public datepipe: DatePipe, taskManagementService: TaskManagementService
               ) {}
ngOnChanges() {
  this.CreatedBy = this.gTask.createdBy;
  this.AssignedTo = this.gTask.assignedTo;
  this.SelectedStatus = this.gTask.status;
  this.newTask.setValue({
    taskId: this.gTask.taskId,
    parentTaskId: this.gTask.parentTaskId,
    createdBy: this.gTask.createdBy,
    status: this.gTask.status,
    positionAfter: this.gTask.positionAfter,
    description: this.gTask.description,
    deadline: this.gTask.deadline,
    score: this.gTask.score,
    assignedTo: this.gTask.assignedTo
}); }

ngOnInit() {
}


}
