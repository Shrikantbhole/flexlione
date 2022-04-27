export class TaskScheduleModel {
  taskScheduleId: string;
  taskId: string;
  description: string;
  date: string;
  startHour: number;
  startMinute: number;
  stopHour: number;
  stopMinute: number;
  owner: string;
  taskSummaryId: string;
}
