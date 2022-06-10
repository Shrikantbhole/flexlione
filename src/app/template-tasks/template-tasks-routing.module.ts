import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core';
import {TemplateComponent} from './template/template.component';
import {ArticleResolver} from '../article/article-resolver.service';
import {TemplateTasksResolverService} from './template-tasks-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    resolve: {
      // taskMaster: TemplateTasksResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateTasksRoutingModule {}
