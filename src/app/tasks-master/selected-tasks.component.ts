import {Component, Input} from '@angular/core';
import {Task} from '../article/models/task.model';
import { AddOrEditTaskDialogComponent} from '../tasks-hierarchy/task-tree/add-or-edit-task-dialog.component';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EditorComponent} from '../editor/editor.component';

@Component({
  selector: 'app-selected-tasks',
  templateUrl: './selected-tasks.component.html',

})

export class SelectedTasksDisplayComponent {

  @Input() y: Task [];
  selectedTaskId: string;
 public taskForGeneration: Task;
  constructor() {

  }

  onClickGenerate(task: Task) {
this.taskForGeneration = task;
    console.log(this.taskForGeneration)
    ;
}}
