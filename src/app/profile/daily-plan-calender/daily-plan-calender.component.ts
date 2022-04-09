import {Component, OnInit, ViewChild} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {ProfileComponent} from '../profile.component';
import {ScheduleTaskModel} from '../models/schedule-task.model';


@Component({
  selector: 'app-profile-daily-plan-calender',
  templateUrl: 'daily-plan-calender.component.html'
})

export class DailyPlanCalenderComponent implements OnInit {
  today = new Date();
  viewDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 13, 0);
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  scheduleTaskList: ScheduleTaskModel[] = [];
  events: CalendarEvent[] = [];

  constructor(
    private  profileComponent: ProfileComponent
  ) {  }
  getMonth(viewDate: Date) {
    console.log(viewDate);
    console.log(viewDate.getDay());
  }
  setView(view: CalendarView) {
    this.view = view;
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date);
    this.profileComponent.onDaySummary();
    this.profileComponent.onDailyPlanSummaryChange(this.scheduleTaskList.filter(function (x) {
      return new Date(x.startDate).getDate() === date.getDate(); }));
  }

  dayHeaderClicked(evn): void {
    console.log(evn.day.date);
    this.profileComponent.onDaySummary();
    this.profileComponent.onDailyPlanSummaryChange(this.scheduleTaskList.filter(function (x) {
      return new Date(x.startDate).getDate() === evn.day.date.getDate(); }));
  }

  ngOnInit(): void {
    this.scheduleTaskList = [
      { taskId : '09.1',
        sprintId: '1',
        scheduleTaskId: '1.1',
        description : 'conveyor design',
        startDate : '04-09-2022',
        stopDate: '04-09-2022',
        startHour: 11,
        startMinute: 0,
        stopHour: 12,
        stopMinute: 30},
      { taskId : '09.2',
        sprintId: '1',
        scheduleTaskId: '1.2',
        description : 'conveyor mfg',
        startDate : '04-09-2022',
        stopDate: '04-09-2022',
        startHour: 13,
        startMinute: 0,
        stopHour: 14,
        stopMinute: 30},
      { taskId : '10.1',
        sprintId: '1',
        scheduleTaskId: '1.3',
        description : 'Castor design',
        startDate : '04-10-2022',
        stopDate: '04-10-2022',
        startHour: 11,
        startMinute: 0,
        stopHour: 12,
        stopMinute: 30},
      { taskId : '10.2',
        sprintId: '1',
        scheduleTaskId: '10.2',
        description : 'Castor Mfg',
        startDate : '04-10-2022',
        stopDate: '04-10-2022',
        startHour: 13,
        startMinute: 0,
        stopHour: 14,
        stopMinute: 30}
    ];

    for (let i = 0; i < this.scheduleTaskList.length; i++) {
      this.events.push(this.getEventForScheduleTask(this.scheduleTaskList[i]));
    }
  }
  getEventForScheduleTask(scheduleTask: ScheduleTaskModel): CalendarEvent {
    const date: Date = new Date(scheduleTask.startDate);
    const event: CalendarEvent = {
      start:  new Date(date.getFullYear(), date.getMonth(), date.getDate(),
        scheduleTask.startHour, scheduleTask.startMinute),
      title: scheduleTask.description,
      end:  new Date(date.getFullYear(), date.getMonth(), date.getDate(),
        scheduleTask.stopHour, scheduleTask.stopMinute),
    };
    return event;
  }
}
