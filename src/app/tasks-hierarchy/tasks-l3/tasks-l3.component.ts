import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MessageBoxService } from '../../settings/message-box.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import {Task} from '../models/task.model';

import {ApiError} from '../../settings/api-error.model';
import {TaskManagementService} from '../task-management-service';
import {AddOrEditTaskDialogComponent} from '../task-tree/add-or-edit-task-dialog.component';
import {ViewChecklistDialogComponent} from '../tasks-l1/view-checklist-dialog.component';


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
  public l3TaskList: Task[];

  // services

  private dialog: MatDialog;
  private messageBoxService: MessageBoxService;

  private taskManagementService: TaskManagementService;
  private snackBarService: MatSnackBar;



  constructor(dialog: MatDialog,
    messageBoxService: MessageBoxService, snackBarService: MatSnackBar,
    activatedRoute: ActivatedRoute,
              taskManagementService: TaskManagementService) {
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
        if (this.l3TaskId != null) {
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

    this.taskManagementService.getTaskList(this.l3TaskId, 'children').subscribe(
      {
        next: (taskList: Task[]) => {
          console.log(taskList);
          this.l3TaskList = taskList;
          console.log(this.l3TaskList);
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

    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {

      isEdit: false,
      parentTaskId: this.l3TaskId,
      taskId: this.l3TaskId + '.' + (this.l3TaskList.length + 1)
    };

    this.dialog.open(AddOrEditTaskDialogComponent, dialogConfig)
      .afterClosed().subscribe(
      {
        next: (task: Task) => {

          if (task == null) { // Cancel button clicked
            return;
          }

          this.snackBarService.open('Success. New Task has been  created.', '', { duration: 3000 });

          // Load the list again
          this.loadL3TaskList();

          //  show it selected and auto-scroll to it
          this.selectedTaskId = task.taskId;
        }
      }
    );
  }

  onEditTaskButtonClick(taskId: string): void {



    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {

      isEdit: true,
      parentTaskId: this.l3TaskList.filter(x => x.taskId === taskId)[0].parentTaskId,
      task: this.l3TaskList.filter(x => x.taskId === taskId)[0]
    };

    this.dialog.open(AddOrEditTaskDialogComponent, dialogConfig)
      .afterClosed().subscribe(
      {
        next: (task: Task) => {

          if (task == null) { // Cancel button clicked
            return;
          }

          this.snackBarService.open('Success. New Task has been  created.', '', { duration: 3000 });

          // Load the list again
          this.loadL3TaskList();

          //  show it selected and auto-scroll to it
          this.selectedTaskId = task.taskId;
        }
      }
    );
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
              this.snackBarService.open('Task deleted.');

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
        next: (task: Task) => {

          if (task == null) { // Cancel button clicked
            return;
          }

          this.snackBarService.open('Success. New Task has been  created.', '', { duration: 3000 });

          // Load the list again
          this.loadL3TaskList();

          //  show it selected and auto-scroll to it
          this.selectedTaskId = task.taskId;
        }
      }
    );
  }
}


