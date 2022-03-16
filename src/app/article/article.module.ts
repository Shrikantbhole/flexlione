import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ArticleComponent } from './article.component';
import { ArticleCommentComponent } from './article-comment.component';
import { ArticleResolver } from './article-resolver.service';
import { MarkdownPipe } from './markdown.pipe';
import { SharedModule } from '../shared';
import { ArticleRoutingModule } from './article-routing.module';
import {TaskHierarchyModule} from '../tasks-hierarchy/task-hierarchy.module';
import {AddOrEditTaskDialogComponent} from '../tasks-hierarchy/task-tree/add-or-edit-task-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  imports: [
    SharedModule,
    ArticleRoutingModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule
  ],
  declarations: [
    ArticleComponent,
    ArticleCommentComponent,
    MarkdownPipe,
    AddOrEditTaskDialogComponent
  ],

  providers: [
    ArticleResolver
  ]
})
export class ArticleModule {}
