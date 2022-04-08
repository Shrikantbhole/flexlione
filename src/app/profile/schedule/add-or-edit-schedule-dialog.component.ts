import { Component, Inject } from '@angular/core';
import { TaskManagementService } from '../../article/service/task-management-service';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MessageBoxService } from '../../settings/message-box.service';
import { ScheduleTaskModel } from '../models/schedule-task.model';
import {ChecklistManagementService} from '../../article/service/checklist-management.service';
import {DatePipe} from '@angular/common';
import {getHourList} from '../../shared/shared-lists/hour-list';


@Component({
  selector: 'app-create-store-order-dialog',
  templateUrl: './add-or-edit-schedule-dialog.component.html',
})
export class AddOrEditScheduleDialogComponent {

  private taskManagementService: TaskManagementService;
  private checklistManagementService: ChecklistManagementService;
  private messageBoxService: MessageBoxService;
  public isEdit: boolean ;
  public taskId: string;
  public hourList: number[] = getHourList();


  // members for data-binding
  newScheduleTask: FormGroup = new FormGroup({
    'scheduleTaskId': new FormControl('', [Validators.required]),
    'taskId': new FormControl(''),
    'description': new FormControl(''),
    'startDate': new FormControl(''),
    'startHour': new FormControl(''),
    'startMinute': new FormControl(''),
    'stopDate': new FormControl(''),
    'stopHour': new FormControl(''),
    'stopMinute': new FormControl('')
  });
  constructor(private datepipe: DatePipe, public dialogRef: MatDialogRef<AddOrEditScheduleDialogComponent>, taskManagementService: TaskManagementService,
              messageBoxService: MessageBoxService, @Inject(MAT_DIALOG_DATA) data,
              checklistManagementService: ChecklistManagementService) {
    this.messageBoxService = messageBoxService;
    this.taskManagementService = taskManagementService;
    this.isEdit = data.isEdit;
    this.checklistManagementService = checklistManagementService;
    this.taskId = data.taskId;
    this.newScheduleTask.setValue({
      scheduleTaskId: data.scheduleTask.scheduleTaskId,
      taskId: data.scheduleTask.taskId,
      description: data.scheduleTask.description,
      startDate: new Date(data.scheduleTask.startDate),
      startHour: data.scheduleTask.startHour,
      startMinute: data.scheduleTask.startMinute,
      stopDate: data.scheduleTask.stopDate,
      stopHour: data.scheduleTask.stopHour,
      stopMinute: data.scheduleTask.stopMinute,
    });
    this.newScheduleTask.controls['description'].disable();
    this.newScheduleTask.controls['taskId'].disable();
  }

  OnInit() {
    this.dialogRef.updateSize('50%', '60%');
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {

    console.log('Update Task Schedule' + this.createTaskSchedule(this.newScheduleTask).startDate);
    this.dialogRef.close();
  }

  createTaskSchedule(newScheduleTask: FormGroup): ScheduleTaskModel {
    const scheduleTask = new ScheduleTaskModel();
    scheduleTask.scheduleTaskId = newScheduleTask.getRawValue().scheduleTaskId;
    scheduleTask.taskId = newScheduleTask.getRawValue().taskId;
    scheduleTask.description = newScheduleTask.getRawValue().description;
    scheduleTask.startDate =  this.datepipe.transform(newScheduleTask.getRawValue().startDate, 'yyyy-MM-dd');
    scheduleTask.startHour = newScheduleTask.getRawValue().startHour;
    scheduleTask.startMinute = newScheduleTask.getRawValue().startMinute;
    scheduleTask.stopDate = newScheduleTask.getRawValue().stopDate;
    scheduleTask.stopHour = newScheduleTask.getRawValue().stopHour;
    scheduleTask.stopMinute = newScheduleTask.getRawValue().stopMinute;
    return scheduleTask;
  }



}

