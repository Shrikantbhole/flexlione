import {TaskSummaryModel} from './task-summary.model';
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
  isPlanned: boolean;
  taskSummary: TaskSummaryModel;

}
