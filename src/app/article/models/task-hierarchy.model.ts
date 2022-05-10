export class TaskHierarchyModel {
  taskHierarchyId: string;
  taskId: string;
  description: string;
  totalEstimatedHours: number;
  totalHoursSpent: number;
  childrenTaskIdList: string[];
  childrenTaskHierarchy?: TaskHierarchyModel[];
}

