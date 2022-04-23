import DateTimeFormat = Intl.DateTimeFormat;

export class TaskModel {
  taskId: string;
  parentTaskId: string;
  createdAt: string;
  deadline: string;
  createdBy: string;
  assignedTo: string;
  status: string;
  sprintId: string;
  positionAfter: string;
  description: string;
  score: number;
  children: TaskModel[];
  downStreamDependencies: TaskModel[];
  upStreamDependencies: TaskModel[];
  siblings: TaskModel[];


}
