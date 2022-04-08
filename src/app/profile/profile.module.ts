import { NgModule } from '@angular/core';


import { ProfileArticlesComponent } from './profile-articles.component';
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
    MatInputModule
  ],
  declarations: [
    ProfileArticlesComponent,
    ProfileComponent,
    ProfileFavoritesComponent,
    AddOrEditScheduleDialogComponent,
    SprintPreviewComponent,
    DailyPlanCalenderComponent
  ],
  providers: [
    ProfileResolver,
  ]
})
export class ProfileModule {}
