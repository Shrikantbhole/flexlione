import {Component, OnInit} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';

@Component({
  selector: 'app-profile-daily-plan-calender',
  templateUrl: 'daily-plan-calender.component.html'
})

export class DailyPlanCalenderComponent  {
  today = new Date();
  viewDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 13, 0);
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
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


}
