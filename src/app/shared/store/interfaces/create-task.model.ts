export interface CreateTaskModel {
  taskId?: string;
  parentTaskId?: string;
  createdBy?: string;
  assignedTo?: string;
  status?: string;
  description?: string;
  deadline?: string;
}
