import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {User, UserService, Profile} from '../core';
import {MatAccordion} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import {ScheduleTaskModel} from './models/schedule-task.model';
import {SprintModel} from './models/sprint.model';
import {Task} from '../article/models/task.model';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['profile.component.css']
})

export class ProfileComponent implements OnInit {
  togglePlanner = 'sprint';
  scheduleTaskList: ScheduleTaskModel[] = [];
  sprintUpdateCounter = 0;
  sprintList: SprintModel[] = [];
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
  ) {  }

  profile: Profile;
  currentUser: User;
  isUser: boolean;

  ngOnInit() {
    this.sprintList[0] = new SprintModel();
    this.sprintList[0].taskList = [];
    this.sprintList[0].taskList[0] = new Task();
    this.sprintList[0].taskList[1] = new Task();

    this.sprintList[1] = new SprintModel();
    this.sprintList[1].taskList = [];
    this.sprintList[1].taskList[0] = new Task();
    this.sprintList[1].taskList[1] = new Task();
    this.sprintList[0].sprintId = '1';
    this.sprintList[0].taskList[0].taskId = '1.1';
    this.sprintList[0].taskList[0].description = '1.1';
    this.sprintList[0].taskList[1].taskId = '1.2';
    this.sprintList[0].taskList[1].description = '1.2';

    this.sprintList[1].sprintId = '2';
    this.sprintList[1].taskList[0].taskId = '2.1';
    this.sprintList[1].taskList[0].description = '2.1';
    this.sprintList[1].taskList[1].taskId = '2.2';
    this.sprintList[1].taskList[1].description = '2.2';
  }

  onPlanSprint() {
    this.togglePlanner = 'sprint';
  }

  onPlanDay() {
    this.togglePlanner = 'day';
  }

  public onDaySummary() {
    this.togglePlanner = 'summary';
  }

  public onTaskAddedToSprint() {
    // Need to refresh a sprint expansion module without user action
    // Each time I have to assign diffn value to sprint Id , so that Sprint component
    // refreshes current opened expansion module
   this.sprintUpdateCounter = this.sprintUpdateCounter + 1;
  }
  public onDailyPlanSummaryChange(scheduleTaskList: ScheduleTaskModel[]) {
    this.scheduleTaskList = scheduleTaskList;
  }
}
