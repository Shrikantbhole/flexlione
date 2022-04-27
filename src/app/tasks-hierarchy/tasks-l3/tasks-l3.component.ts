import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MessageBoxService } from '../../settings/message-box.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskModel} from '../../article/models/task-detail.model';

import {ApiError} from '../../settings/api-error.model';
import {TaskManagementService} from '../../Services/task-management-service';
import {AddOrEditTaskDialogComponent} from '../task-tree/add-or-edit-task-dialog.component';
import {ViewChecklistDialogComponent} from '../tasks-l1/view-checklist-dialog.component';
import * as TaskActions from '../../shared/store/create-task.action';
import {CreateTaskStoreModel} from '../../shared/store/interfaces/create-task-store.model';
import {AppState} from '../../app.state';
import {Store} from '@ngrx/store';


@Component({
  selector: 'app-tasks-l3',
  templateUrl: './tasks-l3.component.html',
})
export class TasksL3Component {

  // members needed for data-binding with html
                    // to be used in dataSource

  public selectedTaskId: string;



  public l2TaskId: string;
  public l1TaskId: string;
  public l3TaskId: string;
  public l3Task: TaskModel;

  // services

  private dialog: MatDialog;
  private messageBoxService: MessageBoxService;

  private taskManagementService: TaskManagementService;
  private snackBarService: MatSnackBar;



  constructor(dialog: MatDialog,
    messageBoxService: MessageBoxService, snackBarService: MatSnackBar, private router: Router, private store: Store<AppState>,
    activatedRoute: ActivatedRoute, taskManagementService: TaskManagementService ) {
    this.dialog = dialog;

    this.messageBoxService = messageBoxService;
    this.snackBarService = snackBarService;

    this.taskManagementService = taskManagementService;

    activatedRoute.queryParams.subscribe({
      next: (params: Params) => {

        this.l1TaskId = params.L1;
        this.l2TaskId = params.L2;
        this.l3TaskId = params.L3;
        // Load Only if l2 task id has value
        // Other wise loading null will load all head task
        if (this.l3TaskId !== undefined) {
          this.loadL3TaskList();
        }
      }
    });
  }

  onRowClick(taskId: string): void {
    this.selectedTaskId = taskId;
  }

  loadL3TaskList() {

    // empty the ptl station list, so that loading appears on the screen

    // this.l3TaskList = this.taskReportingService.getJSON().filter(x => x.parentTaskId === this.l3TaskId);

    this.taskManagementService.getTaskById(this.l3TaskId, 'children').subscribe(
      {
        next: (task: TaskModel) => {
          console.log(task);
          this.l3Task = task;
          this.l3Task.children = this.l3Task.children.filter(function ( taskModel) {
            return taskModel.isRemoved === false;
          }); // Hide removed tasks
          console.log(this.l3Task);
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
    const task: CreateTaskStoreModel = {parentTaskId : this.l3Task.taskId};
    this.store.dispatch(new TaskActions.AddCreateTask(task));
    this.router.navigateByUrl('/editor');
  }

  onVisitTask(): void {

    this.router.navigateByUrl('/article/' + this.selectedTaskId);


  }


  onDeleteTaskButtonClick(taskId: string): void {

    // Open a dialog box to ask for confirmation


    this.messageBoxService.confirmWarn(
      'Are you sure you want to delete task ' + taskId + '?'
      + ' All theChild Tasks of this task  will also be deleted.', 'Delete')
      .afterClosed().subscribe({

      next: (proceed: boolean) => {

        // if proceed is true, that means user has confirmed
        if (proceed) {

          // send request to server to delete the PTL station
          this.taskManagementService.deleteTask(taskId).subscribe({
            next: () => {

              // show acknowledgement to user
              this.snackBarService.open('TaskModel deleted.');

              // load the list again
              this.loadL3TaskList();
            },

            // show error dialog box if server failed to delete
            error: () => this.messageBoxService.info('Error: Failed to delete PTL station')
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

          this.snackBarService.open('Success. New TaskModel has been  created.', '', { duration: 3000 });

          // Load the list again
          this.loadL3TaskList();

          //  show it selected and auto-scroll to it
          this.selectedTaskId = task.taskId;
        }
      }
    );
  }
}


