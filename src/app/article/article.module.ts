import {  NgModule } from '@angular/core';
import { ArticleComponent } from './article.component';
import { ArticleCommentComponent } from './article-comment.component';
import { ArticleResolver } from './article-resolver.service';
import { MarkdownPipe } from './markdown.pipe';
import { SharedModule } from '../shared';
import { ArticleRoutingModule } from './article-routing.module';
import {AddOrEditTaskDialogComponent} from '../tasks-hierarchy/task-tree/add-or-edit-task-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {ViewChecklistComponent} from './view-checklist.component';
import {TaskFormComponent} from './task-form.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogConfig, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {AddOrEditChecklistDialogComponent} from './add-or-edit-checklist-dialog.component';



@NgModule({
  imports: [
    SharedModule,
    ArticleRoutingModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatDialogModule
  ],
  declarations: [
    ArticleComponent,
    ArticleCommentComponent,
    MarkdownPipe,
    AddOrEditTaskDialogComponent,
    ViewChecklistComponent,
    TaskFormComponent,
    AddOrEditChecklistDialogComponent
  ],

  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
    ArticleResolver,
    MatSnackBar
  ]
})
export class ArticleModule {}