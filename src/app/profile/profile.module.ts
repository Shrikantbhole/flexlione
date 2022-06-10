import { NgModule } from '@angular/core';


import { ProfileTaskDumpComponent } from './profile-task-dump/profile-task-dump.component';
import { ProfileComponent } from './profile.component';
import { ProfileFavoritesComponent } from './profile-favorites.component';
import { ProfileResolver } from './profile-resolver.service';
import { SharedModule } from '../shared';
import { ProfileRoutingModule } from './profile-routing.module';
import {HomeModule} from '../home/home.module';
import {CalendarModule} from 'angular-calendar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldControl, MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {AddOrEditScheduleDialogComponent} from './schedule/add-or-edit-schedule-dialog.component';
import {MatInputModule} from '@angular/material/input';
import {SprintPreviewComponent} from './sprint/sprint-preview.component';
import {DailyPlanCalenderComponent} from './daily-plan-calender/daily-plan-calender.component';
import {DailyPlanSummaryComponent} from './daily-plan-summary/daily-plan-summary.component';
import {TaskSummaryFormComponent} from './daily-plan-summary/task-summary/task-summary-form.component';
import {SearchFormComponent} from '../home/Search/search-form.component';
import {ActivatedRouteSnapshot} from '@angular/router';
import {AddOrEditSprintDialogComponent} from './sprint/add-or-edit-sprint-dialog.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatDialogModule} from '@angular/material/dialog';
import {TaskScheduleHandlerComponent} from './schedule/task-schedule-handler.component';

@NgModule({
  imports: [
    SharedModule,
    ProfileRoutingModule,
    HomeModule,
    CalendarModule,
    MatExpansionModule,
    MatIconModule,
    MatDatepickerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule
  ],
  declarations: [
    ProfileTaskDumpComponent,
    ProfileComponent,
    ProfileFavoritesComponent,
    AddOrEditScheduleDialogComponent,
    AddOrEditSprintDialogComponent,
    SprintPreviewComponent,
    DailyPlanCalenderComponent,
    DailyPlanSummaryComponent,
    TaskSummaryFormComponent,
    TaskScheduleHandlerComponent
  ],
  providers: [
    ProfileResolver,
    SearchFormComponent,
    ProfileComponent
  ]
})
export class ProfileModule {}
