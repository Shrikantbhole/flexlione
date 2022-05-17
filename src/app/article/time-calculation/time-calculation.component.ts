import {ActivatedRoute, Router} from '@angular/router';
import {ArticlesService, CommentsService, UserService} from '../../core';
import {ChecklistManagementService} from '../../Services/checklist-management.service';
import {TaskModel} from '../models/task-detail.model';
import {Component, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MessageBoxService} from '../../settings/message-box.service';
import {DailyPlanSummaryService} from '../../Services/daily-plan-summary.service';
import {TaskSummaryModel} from '../../profile/models/task-summary.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-article-time-calculation',
  templateUrl: './time-calculation.component.html',
  styleUrls: ['../article.component.css']
})

export class TimeCalculationComponent {
  task: TaskModel;
  @Input() TaskHierarchyList;
  TaskSummaryList: TaskSummaryModel[];

  constructor(
    private route: ActivatedRoute,
    private dailyPlanSummaryService: DailyPlanSummaryService
  ) {
  }

  public GetTaskSummaryForTaskId(taskId: string) {
    this.dailyPlanSummaryService.getTaskSummaryByTaskId(taskId, 'allChildren', this.onSuccess);
  }

  onSuccess = (taskSummaryList: TaskSummaryModel[]) => {
    this.TaskSummaryList = taskSummaryList;
    this.TaskSummaryList.forEach(function (value) {
      const date = new Date(value.date);
      value.date = date.getFullYear() + ' - ' + (date.getMonth() + 1) + ' - ' + date.getDate();
    });
  }
}

