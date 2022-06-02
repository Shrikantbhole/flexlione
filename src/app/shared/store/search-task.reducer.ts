
import {SearchTaskViewStoreModel} from './interfaces/search-task-view-store.model';
import {CreateTaskStoreModel} from './interfaces/create-task-store.model';
import * as TaskActions from './search-task.action';






export function SearchTaskReducer(state: SearchTaskViewStoreModel[] = [], action: TaskActions.SearchActions) {

  // Section 3
  // First, we use a switch to determine the type of action.
  // In the case of adding a tutorial, we return the new state

  // What have we done in the return statement?
  // ...state,X is a method to push X into array state
  switch ( action.type) {
    case TaskActions.ADD_SEARCH_TASK:
      const newAddState = action.payload;
      console.log(newAddState);
      return newAddState;
    case TaskActions.REMOVE_SEARCH_TASK:
      const newState = [];
      return newState;
    default:
      return state;
  }
}

