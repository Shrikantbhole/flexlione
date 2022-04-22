import {Component, DoCheck, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Task} from '../article/models/task.model';
import { AddOrEditTaskDialogComponent} from '../tasks-hierarchy/task-tree/add-or-edit-task-dialog.component';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EditorComponent} from '../editor/editor.component';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskManagementService} from '../article/service/task-management-service';
import {Template} from '../article/models/template.model';



@Component({
  selector: 'app-selected-tasks',
  templateUrl: './selected-tasks.component.html',

})

export class SelectedTasksDisplayComponent implements OnInit{

  public templateTasks: Task[] = [];
  public selectedTaskId: string;
  public selectedTemplate: Template;
  public selectedTemplateId: string;
  public selectedTasks: Task [] = [];
  private taskManagementService: TaskManagementService;
  private templateData: Template[];
  private activatedRoute: ActivatedRoute;
  constructor(
    activatedRoute: ActivatedRoute, taskManagementService: TaskManagementService, private router: Router,
  ) {
    this.taskManagementService = taskManagementService;

    activatedRoute.queryParams.subscribe({
      next: (params: Params) => {
        this.selectedTemplateId = params.templateId;
        console.log(this.selectedTemplateId);
        if (this.selectedTemplateId !== undefined) {

        }
      }
    });
  }

  @Input() y: Task [];
  // selectedTaskId: string;
 public taskForGeneration: Task;
 // public selectedTasks: Task [] = [];
public isEdit = false;
  public action = 'generate';
  eTaskId: string;

  onClickGenerate(task: Task) {
this.taskForGeneration = task;
    console.log(this.taskForGeneration);
    }

  ngOnInit(): void {
    this.selectedTasks = this.y;
  }


  changeButtonStatus() {
    console.log('yes it happened');
    this.isEdit = true;
}

  onClickRefresh() {
    for (let i = 0; i < this.selectedTasks.length; i++) {
      this.selectedTasks.pop();
    }
    for (let i = 0; i < this.selectedTasks.length; i++) {
      this.selectedTasks.pop();
    }
    for (let i = 0; i < this.selectedTasks.length; i++) {
      this.selectedTasks.pop();
    }
  }

  onSaveButtonClick(task: Task) {
this.eTaskId = task.taskId;
  }
}


