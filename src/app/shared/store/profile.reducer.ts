
import {SearchTaskViewStoreModel} from './interfaces/search-task-view-store.model';
import {CreateTaskStoreModel} from './interfaces/create-task-store.model';
import {ProfileModel} from '../../profile/models/profile.model';
import * as ProfileAction from './profile.action';


export function ProfileReducer(state: ProfileModel[] = [], action: ProfileAction.ProfileActions) {

  // Section 3
  // First, we use a switch to determine the type of action.
  // In the case of adding a tutorial, we return the new state

  // What have we done in the return statement?
  // ...state,X is a method to push X into array state

  console.log(state);
  switch (action.type) {
    case ProfileAction.ADD_Profile:
      console.log(action.payload);
      return [...state, action.payload];
    case ProfileAction.REMOVE_Profile:
      const newState = [];
      return newState;
    default:
      return state;
  }
}
