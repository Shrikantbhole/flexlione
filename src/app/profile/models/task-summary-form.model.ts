import DateTimeFormat = Intl.DateTimeFormat;
import {FormControl, FormGroup} from '@angular/forms';
import {Tag} from '@angular/compiler/src/i18n/serializers/xml_helper';

export class  TaskSummaryForm {
  taskSummaryId: string;
  taskId: string;
  description?: string;
  expectedOutput?: string[];
  expectedHours?: string[];
  actualOutput?: string;
  actualHours?: string[];
  date?: string;
}

export function CreateTaskSummaryForm(): FormGroup {
  return new FormGroup({
    'taskSummaryId': new FormControl(''),
    'taskId': new FormControl(''),
    'description': new FormControl(''),
    'expectedOutput': new FormControl(''),
    'expectedHours': new FormControl(''),
    'actualOutput': new FormControl(''),
    'actualHours': new FormControl(''),
  });
}



