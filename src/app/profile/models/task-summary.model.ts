import DateTimeFormat = Intl.DateTimeFormat;
import {FormControl, FormGroup} from '@angular/forms';
import {Tag} from '@angular/compiler/src/i18n/serializers/xml_helper';

export class TaskSummaryModel {
  taskSummaryId: string;
  taskScheduleId: string;
  taskId: string;
  description?: string;
  expectedOutput?: string;
  expectedHour?: number;
  actualOutput?: string;
  actualHour?: number;
  date?: string;
}

export function CreateTaskSummaryForm(): FormGroup {
  return new FormGroup({
    'taskSummaryId': new FormControl(''),
    'taskScheduleId': new FormControl(''),
    'taskId': new FormControl(''),
    'description': new FormControl(''),
    'expectedOutput': new FormControl(''),
    'expectedHours': new FormControl(''),
    'actualOutput': new FormControl(''),
    'actualHours': new FormControl(''),
  });
}



