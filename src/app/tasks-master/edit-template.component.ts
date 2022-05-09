import {Component} from '@angular/core';
import {TaskModel} from '../article/models/taskModel';
import {ApiError} from '../settings/api-error.model';
import {MatDialog} from '@angular/material/dialog';
import {MessageBoxService} from '../settings/message-box.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TaskManagementService} from '../article/service/task-management-service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {Template} from '../article/models/template.model';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html'
})
export class EditTemplateComponent {

  // members needed for data-binding with html
  public data: TaskModel[];
  public childTaskList: TaskModel[];
  public Task: TaskModel ;

  // services
  private dialog: MatDialog;
  private messageBoxService: MessageBoxService;
  private snackBarService: MatSnackBar;
  private taskManagementService: TaskManagementService;
  private router: Router;

  public templateTasks: TaskModel[] = [];
  public selectedTaskId: string;
  public selectedTemplate: Template;
  public selectedTemplateId: string;
  public selectedTasks: TaskModel [] = [];
  private templateData: Template;
  public taskIdList: string[] = [] ;

  constructor(activatedRoute: ActivatedRoute, dialog: MatDialog, messageBoxService: MessageBoxService, snackBarService: MatSnackBar,
              taskManagementService: TaskManagementService, router: Router, private store: Store<AppState> ) {
    this.dialog = dialog;
    this.messageBoxService = messageBoxService;
    this.snackBarService = snackBarService;
    this.taskManagementService = taskManagementService;
    this.router = router;
    this.loadParentTasks();
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

  loadParentTasks() {
    this.taskManagementService.getTaskById('0', 'children').subscribe(
      {
        next: (task: TaskModel) => {
          this.Task = task;
          this.childTaskList = task.children;
        },
        error: (apiError: ApiError) => this.messageBoxService.info('Could not find taskId', apiError.title, apiError.detail)
      });
  }

  onRowClick(taskId: string) {
  }

  loadSelectedTemplateTasks() {
    this.templateTasks = [];
    this.taskManagementService.getTemplateById(this.selectedTemplateId, 'taskDetails' )
      .subscribe( data => {this.templateData = data;
        this.templateTasks = this.templateData.taskList; });
  }

  onClickAdd(taskId: string) {
    this.taskIdList.push(taskId);
    this.messageBoxService.confirmWarn(
      'Task Id ' + taskId + ' will be added to template ' + this.selectedTemplateId)
      .afterClosed().subscribe({

      next: (proceed: boolean) => {
        if (proceed) {
          this.taskManagementService.addTaskToTemplate(this.taskIdList, this.selectedTemplateId, this.onAddConfirm);
        }
      }
    });

    }
  onAddConfirm = (task: TaskModel)  => {
    this.snackBarService.open('Task Successfully added to template', '', {duration: 2000});
    this.loadSelectedTemplateTasks();
  }

  onClickRemove(taskId: string) {
    this.taskIdList.push(taskId);
    this.messageBoxService.confirmWarn(
      'Task Id ' + taskId + ' will be removed from template ' + this.selectedTemplateId)
      .afterClosed().subscribe({

      next: (proceed: boolean) => {
        if (proceed) {
          this.taskManagementService.removeTaskFromTemplate(this.taskIdList, this.selectedTemplateId, this.onRemoveConfirm);
        }
      }
    });
  }
  onRemoveConfirm = (task: TaskModel)  => {
      this.snackBarService.open('Task Successfully removed from template', '', {duration: 2000});
      this.loadSelectedTemplateTasks();
  }
}
