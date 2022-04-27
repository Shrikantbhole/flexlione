import {TaskModel} from './task-detail.model';
export class Dependency {
  dependencyId: string;
  taskId: string;
  dependentTaskId: string;
  description: string;
  taskEditModel: TaskModel;
}
