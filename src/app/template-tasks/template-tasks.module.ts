import { ModuleWithProviders, NgModule } from '@angular/core';

import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TemplateTasksRoutingModule} from './template-tasks-routing.module';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {TemplateComponent} from './template/template.component';
import {ArticleModule} from '../article/article.module';
import {TemplateTasksResolverService} from './template-tasks-resolver.service';
import {TemplateTaskComponent} from './tasks/template-task.component';
import {SelectedTasksDisplayComponent} from './selectedTasks/selected-tasks.component';
import {GenerateTaskForTemplateComponent} from './generateTasks/generate-task-for-template.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {EditTemplateComponent} from './add&editTemplate/edit-template.component';
import {AddTemplateComponent} from './add&editTemplate/add-template.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TaskFormComponent} from '../shared/task-form/task-form.component';




@NgModule({
  imports: [
    SharedModule,
    TemplateTasksRoutingModule,
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
    ReactiveFormsModule
  ],
  declarations: [
    TemplateComponent, TemplateTaskComponent,
    SelectedTasksDisplayComponent, GenerateTaskForTemplateComponent,
    EditTemplateComponent, AddTemplateComponent
  ],
  providers: [
    MatSnackBar,
    TemplateTasksResolverService
  ]
})
export class TemplateTasksModule {}
