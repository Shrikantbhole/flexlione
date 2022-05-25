import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { TaskModel } from '../../article/models/task-detail.model';

import { MessageBoxService } from '../../settings/message-box.service';
import { MatSnackBar } from '@angular/material/snack-bar';


import {ActivatedRoute, Params, Router} from '@angular/router';

import {ApiError} from '../../settings/api-error.model';
import {TaskManagementService} from '../../Services/task-management-service';
import {ViewChecklistDialogComponent} from '../tasks-l1/view-checklist-dialog.component';
import * as TaskActions from '../../shared/store/create-task.action';
import {CreateTaskStoreModel} from '../../shared/store/interfaces/create-task-store.model';
import {AppState} from '../../app.state';
import {Store} from '@ngrx/store';


@Component({
  selector: 'app-tasks-l2',
  templateUrl: './tasks-l2.component.html',
})
export class TasksL2Component {

  // members needed for data-binding with html
                  // to be used in dataSource
  public ptlStationId: string;
  public l2TaskId: string;
  public l1TaskId: string;
  public l2Task: TaskModel;
  public selectedTaskId: string;


  // services

  private dialog: MatDialog;
  private messageBoxService: MessageBoxService;

  private taskManagementService: TaskManagementService;
  private snackBarService: MatSnackBar;
  private inUse: String;


  constructor(dialog: MatDialog,
    messageBoxService: MessageBoxService, snackBarService: MatSnackBar,
    activatedRoute: ActivatedRoute, taskManagementService: TaskManagementService, private router: Router,
              private store: Store<AppState>) {
    this.dialog = dialog;

    this.messageBoxService = messageBoxService;
    this.snackBarService = snackBarService;

    this.taskManagementService = taskManagementService;

    activatedRoute.queryParams.subscribe({
      next: (params: Params) => {

         this.l1TaskId = params.L1;
         this.l2TaskId = params.L2;

         // Load Only if l2 task id has value
        // Other wise loading null will load all head task
         if (this.l2TaskId !== undefined) {
           this.loadL2TaskList() ;
         }
      }
    });
  }
  currentDate: Date = new Date();
  onRowClick(taskId: string): void {
    this.selectedTaskId = taskId;
  }

  loadL2TaskList() {

    this.taskManagementService.getTaskById(this.l2TaskId, 'children').subscribe(
      {
        next: (task: TaskModel) => {
          console.log(task);
          this.l2Task = task;
          this.l2Task.children = this.l2Task.children.filter(function ( taskModel) {
            return taskModel.isRemoved === false;
          }); // Hide removed tasks
          console.log(this.l2Task);
        },
        error: (apiError: ApiError) => this.messageBoxService.info('Could not start wave', apiError.title, apiError.detail)
      });

  }

  // Open a dialog box component to capture data about new resource.
  // It can be argued whether api request should be sent by dialog or the parent
  // component. The dialog should only send api request. In some cases, server might return
  // error. In such a case, if dialog is open then user can make changes to data
  // and send request again.
  onAddNewTaskButtonClick(): void {

    this.store.dispatch(new TaskActions.RemoveCreateTask());
    const task: CreateTaskStoreModel = {parentTaskId : this.l2Task.taskId};
    this.store.dispatch(new TaskActions.AddCreateTask(task));
    this.router.navigateByUrl('/editor');
  }

  onVisitTask(): void {

    this.router.navigateByUrl('/article/' + this.selectedTaskId);


  }

  onRemoveTaskButtonClick(taskId: string): void {

    // Open a dialog box to ask for confirmation


    this.messageBoxService.confirmWarn(
      'Are you sure you want to remove task ' + taskId , 'Remove')
      .afterClosed().subscribe({

      next: (proceed: boolean) => {

        // if proceed is true, that means user has confirmed
        if (proceed) {

          // send request to server to delete the PTL station
          this.taskManagementService.removeTask(taskId).subscribe({
            next: () => {

              // show acknowledgement to user
              this.snackBarService.open('Task Successfully Removed.', '', {duration: 3000});


              // load the list again
              this.loadL2TaskList();
            },

            // show error dialog box if server failed to delete
            error: (apiError: ApiError) => this.messageBoxService.info('Error: Failed to remove TaskId', apiError.title, apiError.detail)
          });
        }
      }
    });
  }

  onCheckListButtonClick(taskId: string): void {

    const dialogConfig: MatDialogConfig = new MatDialogConfig();

    dialogConfig.data = {

      isEdit: false,
      parentTaskId: null,
      taskId: taskId
    };

    this.dialog.open(ViewChecklistDialogComponent, dialogConfig, )
      .afterClosed().subscribe(
      {
        next: (task: TaskModel) => {

          if (task == null) { // Cancel button clicked
            return;
          }

          this.snackBarService.open('Success. New Task has been  created.', '', { duration: 3000 });

          // Load the list again
          this.loadL2TaskList();

          //  show it selected and auto-scroll to it
          this.selectedTaskId = task.taskId;
        }
      }
    );
  }
}


