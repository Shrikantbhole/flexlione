import { SearchTaskViewStoreModel } from './shared/store/interfaces/search-task-view-store.model';
import {CreateTaskStoreModel} from './shared/store/interfaces/create-task-store.model';
import {ProfileModel} from './profile/models/profile.model';
import {ProfileStoreModel} from './shared/store/interfaces/profile-store.model';
import {TaskScheduleModel} from './profile/models/task-schedule.model';


export interface AppState {
  readonly searchTaskView: SearchTaskViewStoreModel[];
  readonly createTask: CreateTaskStoreModel[];
  readonly profile: ProfileStoreModel[];
  readonly taskSchedule: TaskScheduleModel[];

}
