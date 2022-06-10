import {Component} from '@angular/core';
import {TaskModel} from '../../article/models/task-detail.model';
import {ApiError} from '../../settings/api-error.model';
import {MatDialog} from '@angular/material/dialog';
import {MessageBoxService} from '../../settings/message-box.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TaskManagementService} from '../../Services/task-management-service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import {Template} from '../../article/models/template.model';

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
  public taskIdList: [{taskId: string, description: string}]  ;
  public taskToAddList: string[] = [] ;
  public taskToRemoveList: string[] = [] ;
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
    this.taskManagementService.getTaskIdList('' , this.getTaskIdList);
  }
  getTaskIdList = (taskIdList) => {
    this.taskIdList = taskIdList;
    console.log(this.taskIdList);
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
    this.taskToAddList.push(taskId);
    this.messageBoxService.confirmWarn(
      'Task Id ' + taskId + ' will be added to template ' + this.selectedTemplateId)
      .afterClosed().subscribe({

      next: (proceed: boolean) => {
        if (proceed) {
          this.taskManagementService.addTaskToTemplate(this.taskToAddList, this.selectedTemplateId, this.onAddConfirm);
        }
      }
    });

    }
  onAddConfirm = (task: TaskModel)  => {
    this.snackBarService.open('Task Successfully added to template', '', {duration: 2000});
    this.loadSelectedTemplateTasks();
  }

  onClickRemove(taskId: string) {
    this.taskToRemoveList.push(taskId);
    this.messageBoxService.confirmWarn(
      'Task Id ' + taskId + ' will be removed from template ' + this.selectedTemplateId)
      .afterClosed().subscribe({

      next: (proceed: boolean) => {
        if (proceed) {
          this.taskManagementService.removeTaskFromTemplate(this.taskToRemoveList, this.selectedTemplateId, this.onRemoveConfirm);
        }
      }
    });
  }
  onRemoveConfirm = (task: TaskModel)  => {
      this.snackBarService.open('Task Successfully removed from template', '', {duration: 2000});
      this.loadSelectedTemplateTasks();
  }

  onReceiveTaskListConfirm() {
    console.log('Task List Received');
  }
}
