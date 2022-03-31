import { Component, Inject } from '@angular/core';
import { TaskManagementService } from '../../article/service/task-management-service';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MessageBoxService } from '../../settings/message-box.service';
import { Task } from '../../article/models/task.model';
import {ApiError} from '../../settings/api-error.model';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-add-or-edit-dialog',
  templateUrl: './add-or-edit-task-dialog.component.html',
})
export class AddOrEditTaskDialogComponent {

  // Services
  private taskManagementService: TaskManagementService;
  private messageBoxService: MessageBoxService;

  // Creating Scroll fields

  public Tasks: Task[] = [];
  public selectedTask = '';
  public UserList: string[] = ['Chirag', 'Venkatesh', 'Birendra', 'Akash',
  'Tejesh', 'Anuj', 'Sundeep', 'Raja', 'Shrikant', 'Nimmit'];
  public CreatedBy = '';
  public AssignedTo = '';
  public StatusList: string[] = ['yetToStart', 'ongoing', 'onHold', 'completed', 'dropped'];
  public SelectedStatus = '';


 // FormControl to track value of Deadline
  deadline: FormControl = new FormControl(new Date());
  // Track event change in a dare field
  public dateEvent = '';
  // Transform from one format to another
  public  Datepipe: DatePipe;


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

  constructor(public datepipe: DatePipe, public dialogRef: MatDialogRef<AddOrEditTaskDialogComponent>, taskManagementService: TaskManagementService,
    messageBoxService: MessageBoxService, @Inject(MAT_DIALOG_DATA) data) {
    this.messageBoxService = messageBoxService;
    this.taskManagementService = taskManagementService;
    this.isEdit = data.isEdit;
    this.Datepipe = datepipe;
    // this.datePipe.transform(this.date, 'yyyy-MM-dd')

    // Show list of all siblings of current task to align position
    this.taskManagementService.getTaskById(data.parentTaskId, 'children').subscribe(
      {
        next: (task: Task) => {
          this.Tasks = task.children;

        },
        error: (apiError: ApiError) => this.messageBoxService.info('Could not get task list', apiError.title, apiError.detail)
      }
    );

    if (this.isEdit) {

      this.selectedTask = data.task.positionAfter;
      this.CreatedBy = data.task.createdBy;
      this.AssignedTo = data.task.assignedTo;
      this.SelectedStatus = data.task.status;
      this.deadline.setValue(this.getDate(data.task.deadline));
      this.newTask.setValue({
        taskId: data.task.taskId,
        parentTaskId: data.task.parentTaskId,
        createdBy: data.task.createdBy,
        status: data.task.status,
        positionAfter: data.task.positionAfter,
        description: data.task.description,
        deadline: data.task.deadline,
        score: data.task.score,
        assignedTo: data.task.assignedTo
      });
      this.newTask.controls['parentTaskId'].disable();
      this.newTask.controls['taskId'].disable();
      console.log(this.newTask.value);
    } else {
      this.newTask.setValue({
        taskId: 'Server Generated',
        createdBy: '',
        status: '',
        parentTaskId: data.parentTaskId,
        positionAfter: '',
        description: '',
        deadline: '',
        assignedTo: '',
        score: ''
      });
      this.newTask.controls['parentTaskId'].disable();
      this.newTask.controls['taskId'].disable();

    }
  }

  OnInit() {
    this.dialogRef.updateSize('50%', '80%');
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreate(): void {

    this.taskManagementService.createOrUpdateTask(this.createTask(this.newTask))
      .subscribe({

      next: (task: Task) => {
        console.log('New Task successfully created');
        console.log(task);
        this.dialogRef.close(task);
      },
      error: (apiError: ApiError) => {
        this.messageBoxService.info('Error: Task not created .', apiError.title, apiError.detail);
      }
    });
  }

  onUpdate(): void {

    this.taskManagementService.createOrUpdateTask(this.createTask(this.newTask))
      .subscribe({

        next: (task: Task) => {
          console.log('Task successfully updated');
          console.log(task);
          this.dialogRef.close(task);
        },
        error: (apiError: ApiError) => {
          this.messageBoxService.info('Error: Task not updated .', apiError.title, apiError.detail);
        }
      });
  }


  OnDateChange(event: string) {
    // this.events.push(`${type}: ${event.value}`);

      this.dateEvent = event;

  }

  createTask(newTask: FormGroup): Task {
    const task = new Task();
    task.taskId = newTask.getRawValue().taskId;
    task.description = newTask.getRawValue().description;
    task.createdBy = this.CreatedBy;
    task.assignedTo = this.AssignedTo;
    task.score = newTask.getRawValue().score;
    task.status = this.SelectedStatus;
    task.parentTaskId = newTask.getRawValue().parentTaskId;
    task.positionAfter = this.selectedTask;
    task.deadline = this.Datepipe.transform(this.dateEvent, 'yyyy-MM-dd');
    return task;
 }

  getDate(date: any): Date {
    const _date = new Date(date);
    return new Date(
      Date.UTC(_date.getFullYear(), _date.getMonth() , _date.getDate())
    );
  }

}

