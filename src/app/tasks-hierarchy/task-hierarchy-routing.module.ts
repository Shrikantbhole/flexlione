import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core';
import {HeadTasksComponent} from './task-tree/head-tasks.component';

const routes: Routes = [
  {
    path: '',
    component: HeadTasksComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskHierarchyRoutingModule {}
