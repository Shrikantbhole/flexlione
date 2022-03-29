
import {SearchTaskViewModel} from './interfaces/search-task-view.model';
import {CreateTaskModel} from './interfaces/create-task.model';
import * as TaskActions from './create-task.action';


const initialState: SearchTaskViewModel = {
  taskId: ' 23 ',
  parentTaskId: '1',
  createdBy: 'chirag',
  assignedTo: 'chirag',
  status: 'ongoing',
  description: 'blaa',
  deadline: null
};




export function CreateTaskReducer(state: CreateTaskModel[], action: TaskActions.CreateActions) {

  // Section 3
  // First, we use a switch to determine the type of action.
  // In the case of adding a tutorial, we return the new state

  // What have we done in the return statement?
  // ...state,X is a method to push X into array state

  console.log(state);
  switch (action.type) {
    case TaskActions.ADD_CREATE_TASK:
      console.log(action.payload);
      return [action.payload];
    case TaskActions.REMOVE_CREATE_TASK:
      const newState = [];
      return newState;
    default:
      return state;
  }
}
