import {FormControl, FormGroup} from '@angular/forms';


export class  SearchQuery {
  Tag: string;
  Deadline?: string;
  CreatedBy?: string[];
  AssignedTo?: string[];
  Description?: string;
  Status?: string[];
  IncludeRemoved?: boolean;
  TaskId: string;
}

export function SearchQueryForm(): FormGroup {
  return new FormGroup({
    'deadline': new FormControl(''),
    'createdBy': new FormControl(''),
    'assignedTo': new FormControl(''),
    'description': new FormControl(''),
    'status': new FormControl(''),
    'includeRemoved': new FormControl(''),
    'taskId': new FormControl(''),
  });
}






export function GetUserList(): string[] {
  return ['Chirag', 'Venkatesh', 'Birendra', 'Akash',
    'Tejesh', 'Anuj', 'Sundeep', 'Raja', 'Shrikant', 'Nimmit'];
}
