import {Component, Inject, OnInit} from '@angular/core';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MessageBoxService } from '../../settings/message-box.service';
import {DatePipe} from '@angular/common';
import {getHourList} from '../../shared/shared-lists/hour-list';
import {TaskScheduleManagementService} from '../../Services/task-schedule-management.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TaskScheduleModel} from '../models/task-schedule.model';


@Component({
  selector: 'app-add-or-edit-schedule-dialog',
  templateUrl: './add-or-edit-schedule-dialog.component.html',
})
export class AddOrEditScheduleDialogComponent implements OnInit {
  private messageBoxService: MessageBoxService;
  public isEdit: boolean ;
  public taskId: string;
  public hourList: number[] = getHourList();


  // members for data-binding
  newTaskSchedule: FormGroup = new FormGroup({
    'taskScheduleId': new FormControl('', [Validators.required]),
    'taskId': new FormControl(''),
    'description': new FormControl(''),
    'date': new FormControl(''),
    'startHour': new FormControl(''),
    'startMinute': new FormControl(''),
    'stopHour': new FormControl(''),
    'stopMinute': new FormControl(''),
    'owner' : new FormControl(''),
  });
  constructor(private datepipe: DatePipe, public dialogRef: MatDialogRef<AddOrEditScheduleDialogComponent>,
              messageBoxService: MessageBoxService, @Inject(MAT_DIALOG_DATA) data,
              private taskScheduleManagementService: TaskScheduleManagementService,
              private snackBarService: MatSnackBar) {
    this.messageBoxService = messageBoxService;
    this.newTaskSchedule.setValue({
      taskScheduleId: 'Server Generated',
      taskId:  data.task.taskId ,
      description: data.task.description ,
      date: new Date(),
      startHour:  '',
      startMinute:  '',
      stopHour:  '',
      stopMinute: '' ,
      owner: data.task.assignedTo
    });
    this.newTaskSchedule.controls['description'].disable();
    this.newTaskSchedule.controls['taskId'].disable();
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('50%', '70%');
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    this.taskScheduleManagementService.AddOrUpdateTaskSchedule(this.createTaskSchedule(this.newTaskSchedule))
      .subscribe({
        next: (taskSchedule) => {
          this.snackBarService.open('Success! Task Schedule updated', '', {duration: 300});
          this.dialogRef.close(taskSchedule);
          },
        error: () => {}
      });
  }

  createTaskSchedule(newTaskSchedule: FormGroup): TaskScheduleModel {
    const taskSchedule = new TaskScheduleModel();
    taskSchedule.taskScheduleId = newTaskSchedule.getRawValue().taskScheduleId;
    taskSchedule.taskId = newTaskSchedule.getRawValue().taskId;
    taskSchedule.description = newTaskSchedule.getRawValue().description;
    taskSchedule.date =  this.datepipe.transform(newTaskSchedule.getRawValue().date, 'yyyy-MM-dd');
    taskSchedule.startHour = newTaskSchedule.getRawValue().startHour;
    taskSchedule.startMinute = newTaskSchedule.getRawValue().startMinute;
    taskSchedule.stopHour = newTaskSchedule.getRawValue().stopHour;
    taskSchedule.stopMinute = newTaskSchedule.getRawValue().stopMinute;
    taskSchedule.owner = newTaskSchedule.getRawValue().owner;
    return taskSchedule;
  }



}

