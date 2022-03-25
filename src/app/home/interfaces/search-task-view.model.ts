import DateTimeFormat = Intl.DateTimeFormat;
import {FormControl, FormGroup} from '@angular/forms';

export interface SearchTaskViewModel {
  taskId: string;
  parentTaskId: string;
  createdBy: string;
  assignedTo: string;
  status: string;
  description: string;
  deadline: DateTimeFormat;
}


