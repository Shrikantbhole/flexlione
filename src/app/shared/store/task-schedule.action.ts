// Section 1

import { Action } from '@ngrx/store';
import {SearchTaskViewStoreModel} from './interfaces/search-task-view-store.model';
import {CreateTaskStoreModel} from './interfaces/create-task-store.model';
import {TaskScheduleModel} from '../../profile/models/task-schedule.model';



// Section 2
// We're defining the type of action, which is in the form of a string constant.
export const ADD_TASK_SCHEDULE      = '[TaskSchedule] Add';
export const REMOVE_TASK_SCHEDULE    = '[TaskSchedule] Remove';
export const REMOVE_ALL_TASK_SCHEDULE    = '[TaskSchedule] RemoveAll';



// Section 3
// We're creating a class for each action with a constructor that allows us to pass in the payload
// We are also defining Type of action for this particular class

export class AddTaskSchedule implements Action {
  readonly type = ADD_TASK_SCHEDULE;

  constructor(public payload: TaskScheduleModel) {}
}

export class RemoveTaskSchedule implements Action {
  readonly type = REMOVE_TASK_SCHEDULE;

  constructor(public payload: string) {}
}

export class RemoveAllTaskSchedule implements Action {
  readonly type = REMOVE_ALL_TASK_SCHEDULE;

  constructor() {}
}



// Section 4
export type TaskScheduleActions = AddTaskSchedule | RemoveTaskSchedule |RemoveAllTaskSchedule;

