import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import {
  FooterComponent,
  HeaderComponent,
  SharedModule
} from './shared';


import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core';
import {MessageBoxComponent, MessageBoxService} from './settings/message-box.service';
import {TaskManagementService} from './tasks-hierarchy/task-management-service';
import {ChecklistManagementService} from './tasks-hierarchy/checklist-management.service';
import {HandlerError} from './settings/handle-error.service';
import {ServerConfigService} from './settings/server-config.service';
import {MatDatepickerModule} from '@angular/material/datepicker';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import {taskReducer} from './home/store/task.reducer';


@NgModule({
  declarations: [AppComponent, FooterComponent, HeaderComponent,
    MessageBoxComponent],
  imports: [
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    HomeModule,
    AuthModule,
    AppRoutingModule,
    MatDatepickerModule,
    StoreModule.forRoot({
      searchTaskView: taskReducer
    })
  ],
  providers: [TaskManagementService, ChecklistManagementService, HandlerError, MessageBoxService, ServerConfigService],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {}