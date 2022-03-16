import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import {
  FooterComponent,
  HeaderComponent,
  SharedModule
} from './shared';

import {HeadTasksComponent} from './tasks-hierarchy/task-tree/head-tasks.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core';

import {AddOrEditChecklistDialogComponent} from './tasks-hierarchy/tasks-l1/add-or-edit-checklist-dialog.component';
import {AddOrEditTaskDialogComponent} from './tasks-hierarchy/task-tree/add-or-edit-task-dialog.component';
import {TasksL1Component} from './tasks-hierarchy/tasks-l1/tasks-l1.component';
import {TasksL2Component} from './tasks-hierarchy/tasks-l2/tasks-l2.component';
import {TasksL3Component} from './tasks-hierarchy/tasks-l3/tasks-l3.component';
import {ViewChecklistDialogComponent} from './tasks-hierarchy/tasks-l1/view-checklist-dialog.component';
import {MessageBoxComponent, MessageBoxService} from './settings/message-box.service';
import {TaskManagementService} from './tasks-hierarchy/task-management-service';
import {ChecklistManagementService} from './tasks-hierarchy/checklist-management.service';
import {HandlerError} from './settings/handle-error.service';
import {ServerConfigService} from './settings/server-config.service';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
  declarations: [AppComponent, FooterComponent, HeaderComponent,
    AddOrEditChecklistDialogComponent, MessageBoxComponent],
  imports: [
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    HomeModule,
    AuthModule,
    AppRoutingModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule
  ],
  providers: [TaskManagementService, ChecklistManagementService, HandlerError, MessageBoxService, ServerConfigService],
    exports: []
    ,
  bootstrap: [AppComponent]
})
export class AppModule {}
