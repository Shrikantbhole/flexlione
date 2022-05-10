import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StandUpComponent } from './stand-up.component';
import { StandUpResolver } from './stand-up-resolver.service';
import { AuthGuard } from '../core';

const routes: Routes = [
  {
    path: '',
    component: StandUpComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: ':slug',
    component: StandUpComponent,
    canActivate: [AuthGuard],
    resolve: {
      standUp: StandUpResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StandUpRoutingModule {}
