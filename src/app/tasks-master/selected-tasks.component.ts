import {Component, Input, OnInit} from '@angular/core';
import {TaskModel} from '../article/models/taskModel';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskManagementService} from '../article/service/task-management-service';
import {Template} from '../article/models/template.model';



@Component({
  selector: 'app-selected-tasks',
  templateUrl: './selected-tasks.component.html',

})

export class SelectedTasksDisplayComponent implements OnInit {

  public templateTasks: TaskModel[] = [];
  public selectedTaskId: string;
  public selectedTemplate: Template;
  public selectedTemplateId: string;
  public selectedTasks: TaskModel [] = [];
  private taskManagementService: TaskManagementService;
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

  @Input() bundleSelectedTask: TaskModel [];
    public taskForGeneration: TaskModel;
    public isEdit = false;
    public action = 'generate';

  onClickGenerate(task: TaskModel) {
this.taskForGeneration = task;
    console.log(this.taskForGeneration);
    }

  ngOnInit(): void {
    this.selectedTasks = this.bundleSelectedTask;
  }


  changeButtonStatus() {
    this.isEdit = true;
}

  onClickRefresh() {
    this.selectedTasks.splice(0, this.selectedTasks.length);
   }
}


