import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Template} from '../article/models/template.model';
import {Task} from '../article/models/task.model';
import templateData from '../tasks-master/templateData.json';
import {MatDialog} from '@angular/material/dialog';
import {MessageBoxService} from '../settings/message-box.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskManagementService} from '../article/service/task-management-service';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {ApiError} from '../settings/api-error.model';
import {Subscription} from 'rxjs';

function onRowClick(task: any) {

}


@Component({
  selector: 'app-template-task',
  templateUrl: './template-task.component.html',

})

export class TemplateTaskComponent implements OnChanges, OnInit, OnDestroy {





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
           this.loadSelectedTemplateTasks();
          }
        }
      });
    }






  loadSelectedTemplateTasks() {
    this.templateTasks = [];
      this.taskManagementService.getTemplateTasks(this.selectedTemplateId, 'children' )
        .subscribe({next: (data: Template [] ) => {console.log(data); this.templateData = data;

            this.templateTasks = this.templateData.filter(n => n.templateId = this.selectedTemplateId )[0].children;
        }});
      console.log(this.templateData);
    }

  onRowClick(task: Task ) {
    this.selectedTaskId = task.taskId;
    const i = this.selectedTasks.findIndex((t) => t === task);
    console.log(i);
    if (i === -1) {
      this.selectedTasks.push(task);
    } else {
      this.selectedTasks.splice(i, 1);
    }
    console.log(this.selectedTasks);
  }

  ngOnChanges(changes: SimpleChanges): void {

    }
  ngOnInit(): void {

  }

  ngOnDestroy(): void {

    }
  }





