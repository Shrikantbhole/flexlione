import {TaskModel} from './taskModel';
export class Dependency {
  dependencyId: string;
  taskId: string;
  dependentTaskId: string;
  description: string;
  taskEditModel: TaskModel;
}
