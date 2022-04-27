// <<<<<<< HEAD:src/app/shared/store/interfaces/create-task.model.ts
// export interface CreateTaskModel {
//  score?: number;
 // positionAfter?: string;
// =======
 export interface CreateTaskStoreModel {
// >>>>>>> origin/main:src/app/shared/store/interfaces/create-task-store.model.ts
  taskId?: string;
  parentTaskId?: string;
  createdBy?: string;
  assignedTo?: string;
  status?: string;
  description?: string;
  deadline?: string;
}
