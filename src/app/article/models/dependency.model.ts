import {Task} from './task.model';
export class Dependency {
  dependencyId: string;
  taskId: string;
  dependentTaskId: string;
  description: string;
  taskEditModel: Task;
}
