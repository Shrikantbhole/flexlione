export interface CreateTaskModel {
  score?: number;
  positionAfter?: string;
  taskId?: string;
  parentTaskId?: string;
  createdBy?: string;
  assignedTo?: string;
  status?: string;
  description?: string;
  deadline?: string;
}
