import DateTimeFormat = Intl.DateTimeFormat;
import {FormControl, FormGroup} from '@angular/forms';
import {Tag} from '@angular/compiler/src/i18n/serializers/xml_helper';

export class  SearchQuery {
  Tag: string;
  Deadline?: string;
  CreatedBy?: string[];
  AssignedTo?: string[];
  Description?: string;
  Status?: string[];
}

export function CreateSearchForm(): FormGroup {
  return new FormGroup({
    'tag': new FormControl(''),
    'deadline': new FormControl(''),
    'createdBy': new FormControl(''),
    'assignedTo': new FormControl(''),
    'description': new FormControl(''),
    'status': new FormControl(''),
  });
}




export function GetUserList(): string[] {
  return ['Chirag', 'Venkatesh', 'Birendra', 'Akash',
    'Tejesh', 'Anuj', 'Sundeep', 'Raja', 'Shrikant', 'Nimmit'];
}
