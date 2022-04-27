// Section 1

import { Action } from '@ngrx/store';
import {ProfileStoreModel} from './interfaces/profile-store.model';



// Section 2
// We're defining the type of action, which is in the form of a string constant.

export const ADD_Profile       = '[Profile] Add';
export const REMOVE_Profile   = '[Profile] Remove';

// Section 3
// We're creating a class for each action with a constructor that allows us to pass in the payload
// We are also defining Type of action for this particular class



export class AddProfile implements Action {
  readonly type = ADD_Profile;

  constructor(public payload: ProfileStoreModel) {}
}

export class RemoveProfile implements Action {
  readonly type = REMOVE_Profile;

  constructor() {}
}

// Section 4
export type ProfileActions = AddProfile|RemoveProfile;


