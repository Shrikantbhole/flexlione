import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import {
  FooterComponent,
  HeaderComponent,
  SharedModule
} from './shared';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core';
import {MessageBoxComponent, MessageBoxService} from './settings/message-box.service';
import {TaskManagementService} from './Services/task-management-service';
import {ChecklistManagementService} from './Services/checklist-management.service';
import {HandlerError} from './settings/handle-error.service';
import {ServerConfigService} from './settings/server-config.service';
import {MatDatepickerModule} from '@angular/material/datepicker';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { SearchTaskReducer} from './shared/store/search-task.reducer';
import { CreateTaskReducer} from './shared/store/create-task.reducer';
import { ProfileReducer} from './shared/store/profile.reducer';
import {DependencyManagementService} from './Services/dependency-management.service';
import {CommentManagementService} from './Services/comment-management.service';
import {DailyPlanSummaryService} from './Services/daily-plan-summary.service';
import {ProfileManagementService} from './Services/profile-management.service';
import {SprintManagementService} from './Services/sprint-management.service';
import {TaskScheduleManagementService} from './Services/task-schedule-management.service';
import {TaskScheduleReducer} from './shared/store/task-schedule.reducer';


@NgModule({
  declarations: [AppComponent, FooterComponent, HeaderComponent,
    MessageBoxComponent],
  imports: [
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    HomeModule,
    AuthModule,
    AppRoutingModule,
    MatDatepickerModule,
    StoreModule.forRoot({
      searchTaskView: SearchTaskReducer,
      createTask: CreateTaskReducer,
      profile: ProfileReducer,
      taskSchedule: TaskScheduleReducer
    })
    ,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  providers: [TaskManagementService,
    ChecklistManagementService,
    HandlerError,
    MessageBoxService,
    ServerConfigService,
  DependencyManagementService,
    CommentManagementService,
    DailyPlanSummaryService,
    ProfileManagementService,
    SprintManagementService,
    TaskScheduleManagementService
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
