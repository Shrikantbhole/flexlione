import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core';
import {HeadTasksComponent} from './task-tree/head-tasks.component';
import {ArticleResolver} from '../article/article-resolver.service';
import {TaskHierarchyResolverService} from './task-hierarchy-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: HeadTasksComponent,
    canActivate: [AuthGuard],
    resolve: {
      article: TaskHierarchyResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskHierarchyRoutingModule {}
