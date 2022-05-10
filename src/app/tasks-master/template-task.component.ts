import {Component} from '@angular/core';
import {Template} from '../article/models/template.model';
import {TaskModel} from '../article/models/task-detail.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskManagementService} from '../Services/task-management-service';

@Component({
  selector: 'app-template-task',
  templateUrl: './template-task.component.html',

})

export class TemplateTaskComponent {

  public templateTasks: TaskModel[] = [];
  public selectedTaskId: string;
  public selectedTemplate: Template;
  public selectedTemplateId: string;
  public selectedTasks: TaskModel [] = [];
  private taskManagementService: TaskManagementService;
  private templateData: Template;
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

    // this.templateTasks = [];
    //    this.taskManagementService.getTemplateTasks(this.selectedTemplateId, 'children' )
    //      .subscribe({next: (data: Template [] ) => {console.log(data); this.templateData = data;
//
    //          this.templateTasks = this.templateData.filter(n => n.templateId = this.selectedTemplateId )[0].children;
    //     }});
    //    console.log(this.templateData);
    this.templateTasks = [];
     this.taskManagementService.getTemplateById(this.selectedTemplateId, 'taskDetails' )
       .subscribe( data => {this.templateData = data;
       this.templateTasks = this.templateData.taskList; });
    }

  onRowClick(task: TaskModel ) {
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
  onClickSelectAll() {
       for (let i = 0; i < this.templateTasks.length; i++) {
         this.selectedTasks.push(this.templateTasks[i]);
       }
     }
}





