import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core';
import {TaskMasterComponent} from './task-master.component';
import {ArticleResolver} from '../article/article-resolver.service';
import {TasksMasterResolverService} from './tasks-master-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: TaskMasterComponent,
    resolve: {
      // taskMaster: TasksMasterResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskMasterRoutingModule {}
