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

  @Input() y: Task [];
  selectedTaskId: string;
 public taskForGeneration: Task;
 public selectedTasks: Task [];
  isEdit: boolean;
  constructor() {
  }
  onClickGenerate(task: Task) {
this.taskForGeneration = task;
    console.log(this.taskForGeneration);
    }

  ngOnInit(): void {this.selectedTasks = this.y;
  }
}


