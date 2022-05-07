import { ModuleWithProviders, NgModule } from '@angular/core';

import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TaskMasterRoutingModule} from './task-master-routing.module';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {TaskMasterComponent} from './task-master.component';
import {ArticleModule} from '../article/article.module';
import {TasksMasterResolverService} from './tasks-master-resolver.service';
import {TemplateTaskComponent} from './template-task.component';
import {SelectedTasksDisplayComponent} from './selected-tasks.component';
import {GenerateTaskComponent} from './generate-task.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {EditTemplateComponent} from './edit-template.component';




@NgModule({
  imports: [
    SharedModule,
    TaskMasterRoutingModule,
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
    MatButtonModule,
    ArticleModule,
    MatDialogModule,
    MatInputModule,
  ],
  declarations: [
    TaskMasterComponent, TemplateTaskComponent,
    SelectedTasksDisplayComponent, GenerateTaskComponent,
    EditTemplateComponent
  ],
  providers: [
    MatSnackBar,
    TasksMasterResolverService
  ]
})
export class TaskMasterModule {}
