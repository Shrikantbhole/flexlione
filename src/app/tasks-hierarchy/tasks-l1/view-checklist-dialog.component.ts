import { Component, Inject } from '@angular/core';
import { TaskManagementService } from '../../Services/task-management-service';
import { ChecklistManagementService } from '../../Services/checklist-management.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import { TaskModel } from '../../article/models/task-detail.model';
import {CheckListItem} from '../../article/models/check-list-item.model';
import { MessageBoxService } from '../../settings/message-box.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AddOrEditChecklistDialogComponent} from '../../article/checklist/add-or-edit-checklist-dialog.component';



@Component({
  selector: 'app-create-store-order-dialog',
  templateUrl: './view-checklist-dialog.component.html',
})
export class ViewChecklistDialogComponent {

  private taskManagementService: TaskManagementService;
  private messageBoxService: MessageBoxService;
  private checklistManagementService: ChecklistManagementService;

  public Task: TaskModel = new  TaskModel();
  public isEdit: boolean ;
  public Tasks: string[] = ['1', '2', '3'];
  private readonly TaskId: string;
  private CheckIdList: string;
  public checkListItemList: CheckListItem[] = [];
  public selectedCheckListItem: string;
  private dialog: MatDialog;
  private snackBarService: MatSnackBar;


  constructor(snackBarService: MatSnackBar, dialog: MatDialog, public dialogRef: MatDialogRef<ViewChecklistDialogComponent>, taskManagementService: TaskManagementService,
              @Inject(MAT_DIALOG_DATA) data,
              messageBoxService: MessageBoxService, checklistManagementService: ChecklistManagementService) {

    this.taskManagementService = taskManagementService;
    this.isEdit = data.isEdit;
    this.messageBoxService = messageBoxService;
    this.dialog = dialog;
    this.TaskId = data.taskId;
    this.snackBarService = snackBarService;
    this.checklistManagementService = checklistManagementService;

    this.loadCheckList();

  }

  loadCheckList() {

    // this.checkListItemList = this.jsonFileReadingService.getJSON("blaa")



    this.checklistManagementService.getCheckList(this.TaskId, 'items').subscribe(
      {
        // the response is already deserialized and it is in the form of an array or object
        next: (checkListItems: CheckListItem[]) => {
          console.log(checkListItems);
          this.checkListItemList = checkListItems;
        },
        error: () => console.log('Error occured in getting Checklist')
      });

  }



  OnInit() {
    this.dialogRef.updateSize('70%', '90%');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateNewCheckListItemClick(): void {

    const dialogConfig: MatDialogConfig = new MatDialogConfig();

    dialogConfig.data = {

      isEdit: false,
      taskId: this.TaskId

    };

    this.dialog.open(AddOrEditChecklistDialogComponent, dialogConfig)
      .afterClosed().subscribe(
      {
        next: (checkListItem: CheckListItem) => {

          if (checkListItem == null) { // Cancel button clicked
            return;
          }

          this.loadCheckList();
          this.snackBarService.open('Success. New Task has been  created.', '', { duration: 3000 });


        }
      }
    );
  }

  onEditCheckListItemClick(checkListItemId: string): void {

    const dialogConfig: MatDialogConfig = new MatDialogConfig();

    dialogConfig.data = {

      isEdit: true,
      taskId: this.TaskId,
      checkListItem : this.checkListItemList.filter(x => x.checkListItemId === checkListItemId)[0]

    };

    this.dialog.open(AddOrEditChecklistDialogComponent, dialogConfig)
      .afterClosed().subscribe(
      {
        next: (checkListItem: CheckListItem) => {

          if (checkListItem == null) { // Cancel button clicked
            return;
          }

          this.loadCheckList();
          this.snackBarService.open('Success. New Task has been  created.', '', { duration: 3000 });


        }
      }
    );
  }

  onDeleteCheckListItemClick(checkListItemId: string): void {

    // Open a dialog box to ask for confirmation


    this.messageBoxService.confirmWarn(
      'Are you sure you want to delete checkList Item ' + checkListItemId + '?', 'Delete')
      .afterClosed().subscribe({

      next: (proceed: boolean) => {

        // if proceed is true, that means user has confirmed
        if (proceed) {

          // send request to server to delete the PTL station
          this.checklistManagementService.deleteCheckListItem(checkListItemId).subscribe({
            next: () => {
              this.loadCheckList();
              // show acknowledgement to user
              this.snackBarService.open('Checklist item deleted.');

            },

            // show error dialog box if server failed to delete
            error: () => this.messageBoxService.info('Error: Failed to delete PTL station')
          });
        }
      }
    });


  }




  onRowClick(url: string): void {
    window.open(url, '_blank'); // open link in new tab

  }






}

