import DateTimeFormat = Intl.DateTimeFormat;

export class  Task {
  taskId: string;
  parentTaskId: string;
  createdAt: string;
  deadline: string;
  createdBy: string;
  assignedTo: string;
  status: string;
  positionAfter: string;
  description: string;
  score: number;
  children: Task[];
  downStreamDependencies: Task[];
  upStreamDependencies: Task[];
  siblings: Task[];


}
