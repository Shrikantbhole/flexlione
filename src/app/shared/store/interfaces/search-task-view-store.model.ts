import DateTimeFormat = Intl.DateTimeFormat;
import {FormControl, FormGroup} from '@angular/forms';

export interface SearchTaskViewStoreModel {
  taskId: string;
  parentTaskId: string;
  createdBy: string;
  assignedTo: string;
  status: string;
  description: string;
  deadline: Date;
  isRemoved: boolean;
  createdAt: string;
}


