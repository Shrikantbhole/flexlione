import {AfterViewInit, Component, Input} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {ProfileComponent} from '../profile.component';
import {TaskScheduleModel} from '../models/task-schedule.model';
import {TaskScheduleManagementService} from '../../Services/task-schedule-management.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import {Router} from '@angular/router';
import {MatCalendarCellCssClasses} from '@angular/material/datepicker';


@Component({
  selector: 'app-profile-daily-plan-calender',
  templateUrl: 'daily-plan-calender.component.html'
})

export class DailyPlanCalenderComponent  {
  @Input()
  set profile(profileId: string) {
   this.ProfileId = profileId;
  }
  @Input()
  set config(taskScheduleList: TaskScheduleModel[]) {
    this.TaskScheduleList = taskScheduleList;
    this.changeEvents();
  }
  ProfileId: string;
  TaskScheduleList: TaskScheduleModel[] = [];
  today = new Date();
  viewDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 13, 0);
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  events: CalendarEvent[] = [];

  constructor(
    private profileComponent: ProfileComponent,
    private router: Router
  ) {}
  navigate(viewDate: Date) {
    console.log('month: ' + viewDate);
    this.router.navigateByUrl(this.router.url + '?month=' + viewDate.getMonth() + '&year=' + viewDate.getFullYear());
  }
  setView(view: CalendarView) {
    this.view = view;
    console.log('month: ' +  this.viewDate.getMonth());
  }
  dayClickedInMonthView({ date }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date);
   this.router.navigateByUrl(this.router.url + '?date=' + date.getDate());
  }

  dayClickedInWeekView(evn): void {
    console.log(evn.day.date);
    this.router.navigateByUrl(this.router.url + '?date=' + evn.day.date.getDate());
  }

  changeEvents(): void {
    this.events = [];
    for (let j = 0; j < this.TaskScheduleList.length; j++) {
      this.events.push(this.getEventForScheduleTask(this.TaskScheduleList[j]));
    }
  }
  getEventForScheduleTask(taskSchedule: TaskScheduleModel): CalendarEvent {
    const date: Date = new Date(taskSchedule.date);
    const event: CalendarEvent = {
      start:  new Date(date.getFullYear(), date.getMonth(), date.getDate(),
        taskSchedule.startHour, taskSchedule.startMinute),
      title: taskSchedule.description,
      end:  new Date(date.getFullYear(), date.getMonth(), date.getDate(),
        taskSchedule.stopHour, taskSchedule.stopMinute),
    };
    return event;
  }
}
