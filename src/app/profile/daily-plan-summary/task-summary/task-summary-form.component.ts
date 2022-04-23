import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DailyPlanSummaryService} from '../../service/daily-plan-summary.service';
import {ApiError} from '../../../settings/api-error.model';
import {MessageBoxService} from '../../../settings/message-box.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app.state';
import {DatePipe} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {CreateTaskSummaryForm, TaskSummaryModel} from '../../models/task-summary.model';
import {TaskScheduleModel} from '../../models/task-schedule.model';
import * as TaskScheduleActions from '../../../shared/store/task-schedule.action';
/** @title Form field appearance variants */
@Component({
  selector: 'app-profile-task-summary-form',
  templateUrl: './task-summary-form.component.html',
  styleUrls: ['../../profile.component.css']
})
export class TaskSummaryFormComponent implements  OnInit {

  //  FilteredOptions is Observable array created for Auto filling
  newTaskSummary: FormGroup = CreateTaskSummaryForm();
  @Input()
  set config(taskSummary: TaskSummaryModel) {
    this.updateTaskSummaryForm(taskSummary);
  }
  // @Output() newScheduleEvent  = new EventEmitter<TaskSummaryModel>();
  constructor(
    private searchManagementService: DailyPlanSummaryService,
    private  messageBoxService: MessageBoxService,
    private store: Store<AppState>,
    private datePipe: DatePipe,
    private  snackBarService: MatSnackBar,
    private route: ActivatedRoute,
    private  dailyPlanSummaryService: DailyPlanSummaryService,
    private router: Router
  ) {}

  ngOnInit() {}
  updateTaskSummaryForm(taskSummary: TaskSummaryModel) {
    this.newTaskSummary.controls['taskId'].disable();
    this.newTaskSummary.controls['taskSummaryId'].disable();
    this.newTaskSummary.controls['description'].disable();
    this.newTaskSummary.controls['expectedHours'].disable();
    this.newTaskSummary.setValue({
      taskScheduleId: taskSummary.taskScheduleId == null ? 'server-generated' : taskSummary.taskScheduleId,
      taskSummaryId: taskSummary.taskSummaryId == null ? 'server-generated' : taskSummary.taskSummaryId,
      taskId: taskSummary.taskId == null ? 'server-generated' : taskSummary.taskId,
      description: taskSummary.description == null ? 'server-generated' : taskSummary.description,
      expectedOutput: taskSummary.expectedOutput == null ? '' : taskSummary.expectedOutput,
      expectedHours: taskSummary.expectedHour == null ? 'server-generated' : taskSummary.expectedHour,
      actualOutput: taskSummary.actualOutput == null ? '' : taskSummary.actualOutput,
      actualHours: taskSummary.actualHour == null ? '' : taskSummary.actualHour,
    });
  }
  private createTaskSummary(newTaskSummary: FormGroup): TaskSummaryModel {
    const taskSummary = new TaskSummaryModel();
    taskSummary.taskSummaryId = newTaskSummary.getRawValue().taskSummaryId;
    taskSummary.taskScheduleId = newTaskSummary.getRawValue().taskScheduleId;
    taskSummary.taskId = newTaskSummary.getRawValue().taskId;
    taskSummary.description = newTaskSummary.getRawValue().description;
    taskSummary.expectedHour = newTaskSummary.getRawValue().expectedHours;
    if (newTaskSummary.getRawValue().actualHours !== '' && newTaskSummary.getRawValue().actualHours !== undefined)  {
     taskSummary.actualHour = +newTaskSummary.getRawValue().actualHours;
    }
    if (newTaskSummary.getRawValue().expectedOutput !== '' && newTaskSummary.getRawValue().expectedOutput !== undefined)  {
      taskSummary.expectedOutput = newTaskSummary.getRawValue().expectedOutput;
    }
    if (newTaskSummary.getRawValue().actualOutput !== '' && newTaskSummary.getRawValue().actualOutput !== undefined)  {
      taskSummary.actualOutput = newTaskSummary.getRawValue().actualOutput;
    }
    return taskSummary;
  }

  public onAdd() {
    this.dailyPlanSummaryService.updateTaskSummary(this.createTaskSummary(this.newTaskSummary))
      .subscribe({
        next: (taskSummary) => {
          this.snackBarService.open('Task Summary Successfully updated', '' , {duration: 300});
          console.log(taskSummary);
          this.router.navigateByUrl(this.router.url + '?taskScheduleId=' + taskSummary.taskScheduleId);
        },
        error: (apiError: ApiError) => {this.messageBoxService.info('Task summary not updated', apiError.title, apiError.detail); }
      });
  }




}
