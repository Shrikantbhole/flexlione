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
import {SearchFormComponent} from './Search/search-form.component';
import {SearchManagementService} from '../Services/search-management.service';
import {DatePipe} from '@angular/common';
import {SearchQuery} from './models/search-query-form.model';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  exports: [
    SearchFormComponent
  ],
  providers: [
    HomeAuthResolver,
    SearchManagementService,
    DatePipe,
    SearchQuery,
    MatSnackBar
  ]
})
export class HomeModule {}
