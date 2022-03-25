import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import {Task} from '../models/task.model';
import { MessageBoxService } from '../../settings/message-box.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {TaskManagementService} from '../task-management-service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {ApiError} from '../../settings/api-error.model';
import {AddOrEditTaskDialogComponent} from './add-or-edit-task-dialog.component';
import {CheckListTemplate} from '../models/check-list-template.model';
import {ViewChecklistDialogComponent} from '../tasks-l1/view-checklist-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';




@Component({
  selector: 'app-ptl-stations-blaa',
  templateUrl: './head-tasks.component.html',
})
export class HeadTasksComponent {

  // members needed for data-binding with html
  public selectedTaskId: string;
  public data: Task[];
  public Tasks: Task[] = [];
  public TaskIdList: number[] = [];
  public l1TaskId: string;
  public l2TaskId: string;
  public l3TaskId: string;
  private num: number;

  // services
  private dialog: MatDialog;
  private messageBoxService: MessageBoxService;
  private snackBarService: MatSnackBar;
  private taskManagementService: TaskManagementService;
  private router: Router;


  constructor(dialog: MatDialog, messageBoxService: MessageBoxService, snackBarService: MatSnackBar,
              taskManagementService: TaskManagementService, router: Router) {
    this.dialog = dialog;
    this.messageBoxService = messageBoxService;
    this.snackBarService = snackBarService;
    this.taskManagementService = taskManagementService;
    this.router = router;


    this.l1TaskId = '1';
    this.l2TaskId = '1.1';
    this.l3TaskId = '1.1.1';
    this.loadParentTasks();

    // Dummy for testing. needs to be deleted
    console.log('Json testing');
    // this.jsonFileReadingService.getJSON("tasks.json")

  }




  loadParentTasks() {

    // empty the ptl station list, so that loading appears on the screen
    // this.data = this.taskReportingService.getJSON();
    // this.Tasks = this.data.filter(x => x.parentTaskId === null);
    this.taskManagementService.getTaskList(null, 'children').subscribe(
      {
        next: (taskList: Task[]) => {
          console.log(taskList);
          this.Tasks = taskList;

          console.log(this.Tasks);
        },
        error: (apiError: ApiError) => this.messageBoxService.info('Could not start wave', apiError.title, apiError.detail)
      });
  }

  onRowClick(taskId: string): void {
    this.selectedTaskId = taskId;

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
      parentTaskId: null,
    };

    this.dialog.open(AddOrEditTaskDialogComponent, dialogConfig, )
      .afterClosed().subscribe(
        {
          next: (task: Task) => {

            if (task == null) { // Cancel button clicked
              return;
            }

            this.snackBarService.open('Success. New Task has been  created.', '', { duration: 3000 });

            // Load the list again
            this.loadParentTasks();

            //  show it selected and auto-scroll to it
            this.selectedTaskId = task.taskId;
          }
        }
    );
  }

  onAddFromTemplate(): void {

    console.log('Start distribution button clicked.');


  }

  onVisitTask(): void {

   this.router.navigateByUrl('/article/' + this.selectedTaskId);


  }

  onEditTaskButtonClick(taskId: string): void {

    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {

      isEdit: true,
      parentTaskId: null,
      task: this.Tasks.filter(x => x.taskId === taskId)[0]
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
          this.loadParentTasks();

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
              this.loadParentTasks();
            },

            // show error dialog box if server failed to delete
            error: (apiError: ApiError) => this.messageBoxService.info('Error: Failed to delete Task', apiError.title, apiError.detail)
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
      taskId: this.selectedTaskId
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
          this.loadParentTasks();

          //  show it selected and auto-scroll to it
          this.selectedTaskId = task.taskId;
        }
      }
    );



  }
}


