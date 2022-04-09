import {Component, Output, EventEmitter, OnInit, Input, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {CreateSearchForm, GetUserList, SearchQuery} from '../../../home/models/search-query-form.model';
import {Task} from '../../../article/models/task.model';
import {DailyPlanSummaryService} from './../daily-plan-summary.service';
import {ApiError} from '../../../settings/api-error.model';
import {MessageBoxService} from '../../../settings/message-box.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app.state';
import * as TaskActions from '../../../shared/store/search-task.action';
import {DatePipe} from '@angular/common';
import {getUserList} from '../../../shared/shared-lists/user-list';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {ScheduleTaskModel} from '../../models/schedule-task.model';
import {MatAccordion} from '@angular/material/expansion';
import {CreateTaskForm} from '../../../article/models/TaskForm';
import {CreateTaskSummaryForm, TaskSummaryForm} from '../../models/task-summary-form.model';
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
  set config(taskId: string) {
    console.log('Get Summary for Task Id: ' + taskId);
  }
  constructor(
    private searchManagementService: DailyPlanSummaryService,
    private  messageBoxService: MessageBoxService,
    private store: Store<AppState>,
    private datePipe: DatePipe,
    private  snackBarService: MatSnackBar,
    private route: ActivatedRoute,
  ) {}
  private createTaskSummary(newTaskSummary: FormGroup): TaskSummaryForm {
    const taskSummary = new TaskSummaryForm();
    taskSummary.taskSummaryId = newTaskSummary.getRawValue().taskSummaryId;
    taskSummary.taskId = newTaskSummary.getRawValue().taskId;
    taskSummary.description = newTaskSummary.getRawValue().description;
    taskSummary.expectedHours = newTaskSummary.getRawValue().expectedHours;
    if (newTaskSummary.getRawValue().actualHours !== '' && newTaskSummary.getRawValue().actualHours !== undefined)  {
     taskSummary.actualHours = newTaskSummary.getRawValue().actualHours;
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
    console.log('on Add');
  }
  ngOnInit() {}

}
