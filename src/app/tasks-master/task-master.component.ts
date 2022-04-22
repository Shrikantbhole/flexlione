import {Component, OnDestroy, OnInit} from '@angular/core';
import {Task} from '../article/models/task.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticlesService, CommentsService, UserService} from '../core';
import {ChecklistManagementService} from '../article/service/checklist-management.service';
import {Template} from '../article/models/template.model';
import {ApiError} from '../settings/api-error.model';
import {TaskManagementService} from '../article/service/task-management-service';
import {Subscription} from 'rxjs';
import {MessageBoxService} from '../settings/message-box.service';

@Component({
  selector: 'app-task-master',
  templateUrl: './task-master.component.html',
})
export class TaskMasterComponent implements  OnInit, OnDestroy {

  public selectedTemplateId: string;
  public taskManagementService: TaskManagementService;
  public templateData: Template[] ;
  public template: Template;
public a: Subscription;
  private messageBoxService: MessageBoxService;

  constructor(private router: Router, taskManagementService: TaskManagementService, messageBoxService: MessageBoxService, ) {
    this.taskManagementService = taskManagementService;
    this.loadTemplates();
    this.messageBoxService = messageBoxService;
  }

  loadTemplates() {
  this.a =  this.taskManagementService.getTemplateTasks( null, 'children' )
      .subscribe({next: (data: Template [] ) => {console.log(data); this.templateData = data; }});
    console.log(this.templateData);
  }

  ngOnInit() {}

  onRowClick(templateId: string) {this.selectedTemplateId = templateId;
    console.log(this.selectedTemplateId); }

  onClickBack() {
    // Open a dialog box to ask for confirmation

    this.messageBoxService.confirmWarn(
      'All unsaved data will be lost')
      .afterClosed().subscribe({

      next: (proceed: boolean) => {

        // if proceed is true, that means user has confirmed
        if (proceed) {

          this.router.navigateByUrl('/editor');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.a.unsubscribe();
  }
}
