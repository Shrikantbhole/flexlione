import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TaskModel} from './task-detail.model';

export function CreateTaskForm(): FormGroup {
  return  new FormGroup({
    taskId: new FormControl('', [Validators.required]),
    parentTaskId  : new FormControl(null),
    createdBy: new FormControl('', [Validators.required]),
    status: new FormControl(''),
    'positionAfter': new FormControl(''),
    'description': new FormControl(''),
    'deadline': new FormControl(''),
    'assignedTo': new FormControl('', [Validators.required]),
    'score': new FormControl(''),
    'estimatedHrs': new FormControl(''),
    'hrsSpentTillNow': new FormControl(''),

  });
}

export function GetTaskFormFromTaskModel(task: TaskModel): FormGroup {
  const taskForm: FormGroup = CreateTaskForm();
  taskForm.controls['taskId'].setValue(task.taskId);
  taskForm.controls['parentTaskId'].setValue(task.parentTaskId);
  taskForm.controls['createdBy'].setValue(task.createdBy);
  taskForm.controls['status'].setValue(task.status);
  taskForm.controls['deadline'].setValue(new Date(task.deadline));
  taskForm.controls['positionAfter'].setValue(task.positionAfter);
  taskForm.controls['description'].setValue(task.description);
  taskForm.controls['assignedTo'].setValue(task.assignedTo);
  taskForm.controls['score'].setValue(task.score);
  taskForm.controls['estimatedHrs'].setValue(task.estimatedHours);
  taskForm.controls['hrsSpentTillNow'].setValue(task.actualHours);
  return taskForm;
}
