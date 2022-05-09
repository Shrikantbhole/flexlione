import {ActivatedRoute, Router} from '@angular/router';
import {TaskModel} from '../models/task-detail.model';
import {Component, Input, OnInit} from '@angular/core';
import {DailyPlanSummaryService} from '../../Services/daily-plan-summary.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-article-task-session-summary',
  templateUrl: './task-session-summary.component.html',
  styleUrls: ['../article.component.css']
})

export class TaskSessionSummaryComponent {
  @Input() TaskSummaryList;
  task: TaskModel;

  constructor(
    private datepipe: DatePipe
  ) {}

}
