
import {SearchTaskViewStoreModel} from './interfaces/search-task-view-store.model';
import {CreateTaskStoreModel} from './interfaces/create-task-store.model';
import * as TaskActions from './task-schedule.action';
import {TaskScheduleModel} from '../../profile/models/task-schedule.model';





export function TaskScheduleReducer(state: TaskScheduleModel[] = [], action: TaskActions.TaskScheduleActions) {

  // Section 3
  // First, we use a switch to determine the type of action.
  // In the case of adding a tutorial, we return the new state

  // What have we done in the return statement?
  // ...state,X is a method to push X into array state

  console.log(state);
  switch ( action.type) {
    case TaskActions.ADD_TASK_SCHEDULE:
      console.log(action.payload);
      console.log(state);
      return [...state, action.payload];
      case TaskActions.REMOVE_ALL_TASK_SCHEDULE:
        const newState1 = [];
        return newState1;
        case TaskActions.REMOVE_TASK_SCHEDULE:
          let newState = [];
          newState = state.filter(function (value) {return (value.taskScheduleId !== action.payload);
          });
          return newState;
          default:
            return state;
  }
}

