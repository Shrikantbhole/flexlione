import {  NgModule } from '@angular/core';
import { ArticleComponent } from './article.component';
import { ArticleCommentComponent } from './article-comment.component';
import { ArticleResolver } from './article-resolver.service';
import { MarkdownPipe } from './markdown.pipe';
import { SharedModule } from '../shared';
import { ArticleRoutingModule } from './article-routing.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {ViewChecklistComponent} from './checklist/view-checklist.component';
import {TaskFormComponent} from '../shared/task-form/task-form.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogConfig, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {AddOrEditChecklistDialogComponent} from './checklist/add-or-edit-checklist-dialog.component';
import {ViewDependencyComponent} from './dependency/view-dependency.component';
import {AddOrEditDependencyDialogComponent} from './dependency/add-or-edit-dependency-dialog.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {TimeCalculationComponent} from './time-calculation/time-calculation.component';
import {TaskSessionSummaryComponent} from './time-calculation/task-session-summary.component';




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
        MatDialogModule,
        MatInputModule,
        MatExpansionModule
    ],
    declarations: [
        ArticleComponent,
        ArticleCommentComponent,
        MarkdownPipe,
        ViewChecklistComponent,
        TaskFormComponent,
        AddOrEditChecklistDialogComponent,
      ViewDependencyComponent,
      AddOrEditDependencyDialogComponent,
      TimeCalculationComponent,
      TaskSessionSummaryComponent
    ],
    exports: [
        TaskFormComponent,
        TaskSessionSummaryComponent
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
