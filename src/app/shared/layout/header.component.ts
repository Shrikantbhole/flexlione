import { Component, OnInit } from '@angular/core';

import { User, UserService } from '../../core';
import * as TaskActions from '../store/create-task.action';
import {CreateTaskModel} from '../store/interfaces/create-task.model';
import {AppState} from '../../app.state';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  constructor(
    private userService: UserService,
    private store: Store<AppState>
  ) {}

  currentUser: User;

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );
  }

  onAddNewTask() {
    this.store.dispatch(new TaskActions.RemoveCreateTask());
    const task: CreateTaskModel = {parentTaskId : '1'};
    this.store.dispatch(new TaskActions.AddCreateTask(task));
  }
}
