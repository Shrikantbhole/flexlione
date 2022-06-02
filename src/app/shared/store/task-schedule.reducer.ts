
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
  switch ( action.type) {
    case TaskActions.ADD_ALL_TASK_SCHEDULE:
      const newStatePostAddingAllTask = action.payload;
      console.log(newStatePostAddingAllTask);
      return newStatePostAddingAllTask;
      case TaskActions.REMOVE_ALL_TASK_SCHEDULE:
        const newStatePostRemovingAllTask = [];
        return newStatePostRemovingAllTask;
        case TaskActions.REMOVE_TASK_SCHEDULE:
          let newStatePostRemovingTask = [];
          newStatePostRemovingTask = state.filter(function (value) {return (value.taskScheduleId !== action.payload);
          });
          return newStatePostRemovingTask;
          case TaskActions.ADD_TASK_SCHEDULE:
            console.log(action.payload);
            return [...state, action.payload];
          default:
            return state;
  }
}

