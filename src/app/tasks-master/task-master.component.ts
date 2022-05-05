
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Template} from '../article/models/template.model';
import {TaskManagementService} from '../article/service/task-management-service';
import {MessageBoxService} from '../settings/message-box.service';

@Component({
  selector: 'app-task-master',
  templateUrl: './task-master.component.html',
})
export class TaskMasterComponent implements  OnInit {
  public selectedTemplateId: string;
  public taskManagementService: TaskManagementService;
  public templateData: Template[] ;
  public template: Template;
  private messageBoxService: MessageBoxService;

  constructor(private router: Router, taskManagementService: TaskManagementService, messageBoxService: MessageBoxService, ) {
    this.taskManagementService = taskManagementService;
    this.loadTemplates();
    this.messageBoxService = messageBoxService;
  }

  loadTemplates() {

    this.taskManagementService.getAllTemplates( null, 'children' )
      .subscribe({next: (data: Template []) => this.templateData = data}); }
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

  }
