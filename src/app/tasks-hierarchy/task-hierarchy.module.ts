import { ModuleWithProviders, NgModule } from '@angular/core';
import {HeadTasksComponent} from './task-tree/head-tasks.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TaskHierarchyRoutingModule} from './task-hierarchy-routing.module';
import {TasksL1Component} from './tasks-l1/tasks-l1.component';
import {TasksL2Component} from './tasks-l2/tasks-l2.component';
import {TasksL3Component} from './tasks-l3/tasks-l3.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {AddOrEditTaskDialogComponent} from './task-tree/add-or-edit-task-dialog.component';



@NgModule({
  imports: [
    SharedModule,
    TaskHierarchyRoutingModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  declarations: [
  HeadTasksComponent,
    TasksL1Component,
    TasksL2Component,
    TasksL3Component
  ],
  providers: [
    MatSnackBar
  ]
})
export class TaskHierarchyModule {}
