
import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {Template} from '../article/models/template.model';
import {TaskManagementService} from '../Services/task-management-service';
import {MessageBoxService} from '../settings/message-box.service';
import {MatDialog} from '@angular/material/dialog';
import {EditTemplateComponent} from './edit-template.component';
import {AddTemplateComponent} from './add-template.component';
import {MatSnackBar} from '@angular/material/snack-bar';


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
  private snackBarService: MatSnackBar;
  private matDialog: MatDialog;

  constructor(public dialog: MatDialog, private router: Router, taskManagementService: TaskManagementService, messageBoxService: MessageBoxService,
              snackBarService: MatSnackBar ) {
    this.taskManagementService = taskManagementService;
    this.loadTemplates();
    this.messageBoxService = messageBoxService;
    this.snackBarService = snackBarService;
  }

  loadTemplates() {

    this.taskManagementService.getAllTemplates( )
      .subscribe({next: (data: Template []) => this.templateData = data});
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

  onClickCreateNewTemplate() {
   // const dialogRef = this.dialog.open(AddTemplateComponent);
    // dialogRef.close();
    this.dialog.open(AddTemplateComponent);
  }

  onClickEdit() {
this.dialog.open(EditTemplateComponent);
  }

  onClickDelete(templateId) {
    this.messageBoxService.confirmWarn(
      'Are you sure ?')
      .afterClosed().subscribe({

      next: (proceed: boolean) => {
        if (proceed) {
          this.taskManagementService.deleteTemplate(templateId)
            .subscribe({
              next: () => {
                this.snackBarService.open('Template deleted.');
                this.loadTemplates();
              },
              error: () => this.messageBoxService.info('Error: Failed to delete template')
            });
        }
      }
    });
  }
}
