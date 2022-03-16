import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Task } from '../models/task.model';
import { MessageBoxService } from '../../settings/message-box.service';
import { MatSnackBar } from '@angular/material/snack-bar';


import { ActivatedRoute, Params } from '@angular/router';
import {ApiError} from '../../settings/api-error.model';
import {TaskManagementService} from '../task-management-service';
import {AddOrEditTaskDialogComponent} from '../task-tree/add-or-edit-task-dialog.component';
import {ViewChecklistDialogComponent} from './view-checklist-dialog.component';


@Component({
  selector: 'app-tasks-l1',
  templateUrl: './tasks-l1.component.html',
})
export class TasksL1Component {

  // members needed for data-binding with html

  public l1TaskId: string;
  public l2TaskId: string;
  public l3TaskId: string;
  public selectedTaskId: string;
  public num: Number;





  // services

  private dialog: MatDialog;
  private messageBoxService: MessageBoxService;
  private snackBarService: MatSnackBar;
  private taskManagementService: TaskManagementService;
  private inUse: String;
  public l1TaskList: Task[];
  public l1TaskIdList: number[] = [];


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
          this.loadL1TaskList();


      }
    });
  }

  onRowClick(taskId: string): void {
    this.selectedTaskId = taskId;
    this.l2TaskId = taskId;
    this.l3TaskId = this.l2TaskId + '.1';
  }

  loadL1TaskList() {

    // empty the ptl station list, so that loading appears on the screen

    // this.l1TaskList = this.taskReportingService.getJSON().filter(x => x.parentTaskId === this.l1TaskId);

    this.taskManagementService.getTaskList(this.l1TaskId, 'children').subscribe(
      {
        next: (taskList: Task[]) => {
          console.log(taskList);
          this.l1TaskList = taskList;
          this.l1TaskIdList = [];
          this.l1TaskList.forEach(x => {
            const splitted = x.taskId.split('.');
            this.l1TaskIdList.push(Number(splitted[splitted.length - 1]));
          });
          console.log(this.l1TaskList);
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

    if (this.l1TaskIdList.length === 0) {
      this.num = 1;
    } else {
      this. num  = Math.max.apply(null, this.l1TaskIdList) + 1;
    }

    dialogConfig.data = {

      isEdit: false,
      parentTaskId: this.l1TaskId,
      taskId: (this.l1TaskId + '.' + this.num).toString()
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
          this.loadL1TaskList();

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
      parentTaskId: this.l1TaskList.filter(x => x.taskId === taskId)[0].parentTaskId,
      task: this.l1TaskList.filter(x => x.taskId === taskId)[0]
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
          this.loadL1TaskList();

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
              this.loadL1TaskList();
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
          this.loadL1TaskList();

          //  show it selected and auto-scroll to it
          this.selectedTaskId = task.taskId;
        }
      }
    );
 }
}


