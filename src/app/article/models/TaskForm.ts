import {FormControl, FormGroup, Validators} from '@angular/forms';

export function CreateTaskForm(): FormGroup {
  return  new FormGroup({
    taskId: new FormControl('', [Validators.required]),
    parentTaskId  : new FormControl(null),
    createdBy: new FormControl(''),
    'status': new FormControl(''),
    'positionAfter': new FormControl(''),
    'description': new FormControl(''),
    'deadline': new FormControl(''),
    'assignedTo': new FormControl(''),
    'score': new FormControl(''),
    'estimatedHrs': new FormControl(''),
    'hrsSpentTillNow': new FormControl(''),

  });
}
