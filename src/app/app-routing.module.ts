
import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules, Router} from '@angular/router';

export const routes: Routes = [
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'task-tree',
    loadChildren: () => import('./tasks-hierarchy/task-hierarchy.module').then(m => m.TaskHierarchyModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'editor',
    loadChildren: () => import('./editor/editor.module').then(m => m.EditorModule)
  },
  {
    path: 'article',
    loadChildren: () => import('./article/article.module').then(m => m.ArticleModule)
  },
  {
    path: 'master',
    loadChildren: () => import('./tasks-master/task-master.module').then(m => m.TaskMasterModule)
  },
  {
    path: 'stand-up',
    loadChildren: () => import('./stand-up/stand-up.module').then(m => m.StandUpModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preload all modules; optionally we could
    // implement a custom preloading strategy for just some
    // of the modules (PRs welcome 😉)
   // preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(
    // public  router: Router,
    // public  location: Location
  ) {}
}
