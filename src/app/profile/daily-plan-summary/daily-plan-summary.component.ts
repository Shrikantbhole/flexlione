import {Component, Output, EventEmitter, OnInit, Input, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {CreateSearchForm, GetUserList, SearchQuery} from '../../home/models/search-query-form.model';
import {Task} from '../../article/models/task.model';
import {DailyPlanSummaryService} from './daily-plan-summary.service';
import {ApiError} from '../../settings/api-error.model';
import {MessageBoxService} from '../../settings/message-box.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import * as TaskActions from '../../shared/store/search-task.action';
import {DatePipe} from '@angular/common';
import {getStatusList} from '../../shared/shared-lists/status-list';
import {getUserList} from '../../shared/shared-lists/user-list';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {ScheduleTaskModel} from '../models/schedule-task.model';
import {MatAccordion} from '@angular/material/expansion';

/** @title Form field appearance variants */
@Component({
  selector: 'app-profile-daily-plan-summary',
  templateUrl: './daily-plan-summary.component.html',
  styleUrls: ['../profile.component.css']
})
export class DailyPlanSummaryComponent implements  OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  scheduleTaskList: ScheduleTaskModel[] = [];

  @Input()
  set config(scheduleTaskList: ScheduleTaskModel[]) {
    console.log('Get Summary for Task Id: ' + scheduleTaskList[0].taskId);
    this.scheduleTaskList = scheduleTaskList;
  }

  constructor(
    private searchManagementService: DailyPlanSummaryService,
    private messageBoxService: MessageBoxService,
    private store: Store<AppState>,
    private datePipe: DatePipe,
    private snackBarService: MatSnackBar,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
  }
}
