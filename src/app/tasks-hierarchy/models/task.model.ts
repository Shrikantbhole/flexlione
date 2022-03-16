import DateTimeFormat = Intl.DateTimeFormat;

export class  Task {
  taskId: string;
  parentTaskId: string;
  createdAt: DateTimeFormat;
  deadline: string;
  createdBy: string;
  assignedTo: string;
  status: string;
  positionAfter: string;
  description: string;
  score: number;

}
