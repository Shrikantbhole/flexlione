import { NgModule } from '@angular/core';
import { StandUpComponent } from './stand-up.component';
import { StandUpResolver } from './stand-up-resolver.service';
import { SharedModule } from '../shared';
import { StandUpRoutingModule } from './stand-up-routing.module';
import {ArticleModule} from '../article/article.module';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldControl, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
    imports: [SharedModule,
        StandUpRoutingModule,
        ArticleModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule, MatBadgeModule, MatIconModule, MatButtonToggleModule
    ],
  declarations: [StandUpComponent],
  providers: [StandUpResolver]
})
export class StandUpModule {}
