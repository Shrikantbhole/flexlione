import { Component, OnInit } from '@angular/core';

import { User, UserService } from '../../core';
import * as TaskActions from '../store/create-task.action';
import {CreateTaskStoreModel} from '../store/interfaces/create-task-store.model';
import {AppState} from '../../app.state';
import {Store} from '@ngrx/store';
import {ProfileModel} from '../../profile/models/profile.model';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  constructor(
    private userService: UserService,
    private store: Store<AppState>
  ) {}

  currentUser: ProfileModel;

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );
  }

  onAddNewTask() {
    this.store.dispatch(new TaskActions.RemoveCreateTask());
    const task: CreateTaskStoreModel = {parentTaskId : '2'};
    this.store.dispatch(new TaskActions.AddCreateTask(task));
  }
}
