import { SearchTaskViewModel } from './shared/store/interfaces/search-task-view.model';
import {CreateTaskModel} from './shared/store/interfaces/create-task.model';


export interface AppState {
  readonly searchTaskView: SearchTaskViewModel[];
  readonly createTask: CreateTaskModel[];

}
