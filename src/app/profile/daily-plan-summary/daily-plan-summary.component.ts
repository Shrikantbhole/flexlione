import {Component, Output, EventEmitter, OnInit, Input, ViewChild} from '@angular/core';
import {DailyPlanSummaryService} from '../../Services/daily-plan-summary.service';
import {MessageBoxService} from '../../settings/message-box.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import {DatePipe} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskScheduleModel} from '../models/task-schedule.model';
import {MatAccordion} from '@angular/material/expansion';
import {TaskSummaryModel} from '../models/task-summary.model';
import {TaskScheduleManagementService} from '../../Services/task-schedule-management.service';


/** @title Form field appearance variants */
@Component({
  selector: 'app-profile-daily-plan-summary',
  templateUrl: './daily-plan-summary.component.html',
  styleUrls: ['../profile.component.css']
})
export class DailyPlanSummaryComponent implements  OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  TaskScheduleList: TaskScheduleModel[] = [];
  public TaskSummaryModel: TaskSummaryModel = new TaskSummaryModel();
  @Input()
  set config(taskScheduleList: TaskScheduleModel[]) {
    this.TaskScheduleList = taskScheduleList;
  }

  constructor(
    private searchManagementService: DailyPlanSummaryService,
    private messageBoxService: MessageBoxService,
    private store: Store<AppState>,
    private datePipe: DatePipe,
    private snackBarService: MatSnackBar,
    private route: ActivatedRoute,
    private  dailyPlanSummaryService: DailyPlanSummaryService,
    private taskScheduleManagementService: TaskScheduleManagementService,
    private router: Router
  ) {
  }

  ngOnInit() {}
  getTaskSummary(taskSchedule: TaskScheduleModel) {
    if (this.TaskSummaryModel.taskScheduleId === taskSchedule.taskScheduleId) {
      return;
    }
    let newTaskSummaryModel: TaskSummaryModel = new TaskSummaryModel(); // Assigned new model for config function in form to work
    this.dailyPlanSummaryService.getTaskSummaryById(taskSchedule.taskSummaryId)
      .subscribe({
        next: (taskSummaryModel) => {
          console.log(taskSummaryModel);
          if (taskSummaryModel === null) {
            newTaskSummaryModel.taskId = taskSchedule.taskId;
            newTaskSummaryModel.description = taskSchedule.description;
            newTaskSummaryModel.taskScheduleId = taskSchedule.taskScheduleId;
          } else {
            newTaskSummaryModel = taskSummaryModel; }
          newTaskSummaryModel.expectedHour = (taskSchedule.stopHour - taskSchedule.startHour)
                                            + (taskSchedule.stopMinute - taskSchedule.startMinute) / 60;
          newTaskSummaryModel.date = taskSchedule.date;
          this.TaskSummaryModel = newTaskSummaryModel;
          },
        error: () => {}
      });
  }

  onDeleteTaskSchedule(taskScheduleId: string) {
    this.taskScheduleManagementService.deleteTaskScheduleById(taskScheduleId);
    const newTaskScheduleList = this.TaskScheduleList.filter(function (value) {
      return value.taskScheduleId !== taskScheduleId;
    });
    this.TaskScheduleList = newTaskScheduleList;
     this.router.navigateByUrl(this.router.url + '?removeTaskScheduleId=' + taskScheduleId);
  }


}
