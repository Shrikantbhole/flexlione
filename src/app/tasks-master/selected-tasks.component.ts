import {Component, DoCheck, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Task} from '../article/models/task.model';
import { AddOrEditTaskDialogComponent} from '../tasks-hierarchy/task-tree/add-or-edit-task-dialog.component';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EditorComponent} from '../editor/editor.component';



@Component({
  selector: 'app-selected-tasks',
  templateUrl: './selected-tasks.component.html',

})

export class SelectedTasksDisplayComponent implements OnInit {
  constructor() {
  }

  @Input() y: Task [];
  selectedTaskId: string;
 public taskForGeneration: Task;
 public selectedTasks: Task [];
public isEdit = true;
  public action = 'generate';
  onClickGenerate(task: Task) {
this.taskForGeneration = task;
    console.log(this.taskForGeneration);
    }

  ngOnInit(): void {this.selectedTasks = this.y;
  }

  changeButtonStatus() {
    console.log('yes it happened');
    this.isEdit = false;
}
}


