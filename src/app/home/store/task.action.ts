// Section 1

import { Action } from '@ngrx/store';
import {SearchTaskViewModel} from '../interfaces/search-task-view.model';



// Section 2
// We're defining the type of action, which is in the form of a string constant.
export const ADD_TASK       = '[TASK] Add';
export const REMOVE_TASK    = '[TASK] Remove';

// Section 3
// We're creating a class for each action with a constructor that allows us to pass in the payload
// We are also defining Type of action for this particular class

export class AddTask implements Action {
  readonly type = ADD_TASK;

  constructor(public payload: SearchTaskViewModel) {}
}

export class RemoveTask implements Action {
  readonly type = REMOVE_TASK;

  constructor() {}
}

// Section 4
export type Actions = AddTask | RemoveTask;
