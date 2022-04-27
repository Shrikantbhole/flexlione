import { Component } from '@angular/core';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';
import {TaskModel} from '../../article/models/task-detail.model';
import { MessageBoxService } from '../../settings/message-box.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {TaskManagementService} from '../../Services/task-management-service';
import {ApiError} from '../../settings/api-error.model';
import {ViewChecklistDialogComponent} from '../tasks-l1/view-checklist-dialog.component';
import { Router } from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import * as TaskActions from '../../shared/store/create-task.action';
import {CreateTaskStoreModel} from '../../shared/store/interfaces/create-task-store.model';





@Component({
  selector: 'app-ptl-stations-blaa',
  templateUrl: './head-tasks.component.html',
})
export class HeadTasksComponent {

  // members needed for data-binding with html
  public selectedTaskId: string;
  public data: TaskModel[];
  public childTaskList: TaskModel[];
  public Task: TaskModel ;

  // services
  private dialog: MatDialog;
  private messageBoxService: MessageBoxService;
  private snackBarService: MatSnackBar;
  private taskManagementService: TaskManagementService;
  private router: Router;


  constructor(dialog: MatDialog, messageBoxService: MessageBoxService, snackBarService: MatSnackBar,
              taskManagementService: TaskManagementService, router: Router, private store: Store<AppState> ) {
    this.dialog = dialog;
    this.messageBoxService = messageBoxService;
    this.snackBarService = snackBarService;
    this.taskManagementService = taskManagementService;
    this.router = router;
    this.loadParentTasks();

    // Dummy for testing. needs to be deleted
    console.log('Json testing');
    // this.jsonFileReadingService.getJSON("tasks.json")

  }




  loadParentTasks() {

    // empty the ptl station list, so that loading appears on the screen
    // this.data = this.taskReportingService.getJSON();
    // this.Tasks = this.data.filter(x => x.parentTaskId === null);
    this.taskManagementService.getTaskById('0', 'children').subscribe(
      {
        next: (task: TaskModel) => {
          console.log(task);
          this.Task = task;
          this.childTaskList = task.children.filter(function ( taskModel) {
            return taskModel.isRemoved === false;
          }); // Hide Removed Tasks in Hierarchy view

          console.log(this.Task);
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
    this.store.dispatch(new TaskActions.RemoveCreateTask());
    const task: CreateTaskStoreModel = {taskId : null};
    this.store.dispatch(new TaskActions.AddCreateTask(task));
    this.router.navigateByUrl('/editor');
  }

  onAddFromTemplate(): void {

    console.log('Start distribution button clicked.');


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
              this.loadParentTasks();
            },

            // show error dialog box if server failed to delete
            error: (apiError: ApiError) => this.messageBoxService.info('Error: Failed to delete TaskModel', apiError.title, apiError.detail)
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
        next: (task: TaskModel) => {

          if (task == null) { // Cancel button clicked
            return;
          }

          this.snackBarService.open('Success. New TaskModel has been  created.', '', { duration: 3000 });

          // Load the list again
          this.loadParentTasks();

          //  show it selected and auto-scroll to it
          this.selectedTaskId = task.taskId;
        }
      }
    );



  }
}


