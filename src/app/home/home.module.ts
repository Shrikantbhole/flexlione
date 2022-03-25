import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { HomeAuthResolver } from './home-auth-resolver.service';
import { SharedModule } from '../shared';
import { HomeRoutingModule } from './home-routing.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {SearchFormComponent} from './search-form.component';
import {SearchManagementService} from './search-management.service';
import {StoreModule} from '@ngrx/store';
import {taskReducer} from './store/task.reducer'
import {DatePipe} from '@angular/common';
import {SearchQuery} from './models/searchQuery.model';

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  declarations: [
    HomeComponent,
    SearchFormComponent
  ],
  providers: [
    HomeAuthResolver,
    SearchManagementService,
    DatePipe,
    SearchQuery
  ]
})
export class HomeModule {}
