import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {User, UserService, Profile, ArticleListConfig} from '../core';
import {MatAccordion} from '@angular/material/expansion';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CheckListItem} from '../article/models/check-list-item.model';
import {ScheduleTaskModel} from './models/schedule-task.model';
import {AddOrEditScheduleDialogComponent} from './schedule/add-or-edit-schedule-dialog.component';
import {SprintModel} from './models/sprint.model';
import {Task} from '../article/models/task.model';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit {
  today = new Date();
  viewDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 13, 0);
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  planner = 'sprint';
  taskId = '';
  sprintId = '';
  events: CalendarEvent[] = [
    {
      start:  new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 13, 0),
      title: 'Conveyor Design',
      end:  new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 13, 30),

    },
    {
      start:  new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 13, 30),
      title: 'Castor Deck Design',
      end:  new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 14, 30),

    }
  ];
  @ViewChild(MatAccordion) accordion: MatAccordion;
  sprintList: SprintModel[] = [];
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
    this.planner = 'sprint';
  }

  onPlanDay() {
    this.planner = 'day';
  }

  onDaySummary() {
    this.planner = 'summary';
  }


  onRowClick(sprintId: string) {}
  getMonth(viewDate: Date) {
    console.log(viewDate);
    console.log(viewDate.getDay());
  }
  setView(view: CalendarView) {
    this.view = view;
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date);
  }

  dayHeaderClicked(evn): void {
    console.log(evn.day.date);
  }
  onUpdateOrScheduleNewTask(taskId: string): void {
    console.log('scheduling task ' + taskId );
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {

      isEdit: false,
     scheduleTask: this.getScheduleTask(taskId)
    };

    this.dialog.open(AddOrEditScheduleDialogComponent, dialogConfig)
      .afterClosed().subscribe(
      {
        next: (checkListItem: CheckListItem) => {

          if (checkListItem == null) { // Cancel button clicked
            return;
          }
        }
      }
    );
  }
  getScheduleTask(taskId: string): ScheduleTaskModel {
    const  scheduleTask: ScheduleTaskModel = new ScheduleTaskModel();
    scheduleTask.taskId = '23';
    scheduleTask.scheduleTaskId = '2';
    scheduleTask.description = 'blaa';
    scheduleTask.description = '';
    scheduleTask.startDate = new Date().toString();
    scheduleTask.startMinute = 5;
    scheduleTask.startHour = 3;
    scheduleTask.stopDate = '';
    scheduleTask.stopMinute = 2;
    scheduleTask.stopHour = 3;
    return scheduleTask;
  }
  public onTaskAddedToSprint() {
    console.log('It is working');
   this.sprintId = this.sprintId + 'a';
  }
}
