import {Component, OnInit} from '@angular/core';
import {Task} from '../article/models/task.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticlesService, CommentsService, UserService} from '../core';
import {ChecklistManagementService} from '../article/service/checklist-management.service';
import {Template} from '../article/models/template.model';
import {ApiError} from '../settings/api-error.model';
import {TaskManagementService} from '../article/service/task-management-service';

@Component({
  selector: 'app-task-master',
  templateUrl: './task-master.component.html',
})
export class TaskMasterComponent implements  OnInit {

  public selectedTemplateId: string;
  public taskManagementService: TaskManagementService;
  public templateData: Template[] ;
  public template: Template;



  constructor(taskManagementService: TaskManagementService) {
    this.taskManagementService = taskManagementService;
    this.loadTemplates();

  }

  loadTemplates() {
    this.taskManagementService.getTemplateTasks( null, 'children' )
      .subscribe({next: (data: Template [] ) => {console.log(data); this.templateData = data; }});
    console.log(this.templateData);
  }

  ngOnInit() {}

  onRowClick(templateId: string) {this.selectedTemplateId = templateId;
    console.log(this.selectedTemplateId); }

  onClick() {}
}
