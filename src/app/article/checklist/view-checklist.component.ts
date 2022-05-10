import {ActivatedRoute, Router} from '@angular/router';
import {ArticlesService, CommentsService, UserService} from '../../core';
import {ChecklistManagementService} from '../../Services/checklist-management.service';
import {TaskModel} from '../models/task-detail.model';
import {Component, OnInit} from '@angular/core';
import {CheckListItem} from '../models/check-list-item.model';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {AddOrEditChecklistDialogComponent} from './add-or-edit-checklist-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ViewChecklistDialogComponent} from '../../tasks-hierarchy/tasks-l1/view-checklist-dialog.component';
import {MessageBoxService} from '../../settings/message-box.service';

@Component({
  selector: 'app-view-checklist',
  templateUrl: './view-checklist.component.html',
  styleUrls: ['../article.component.css']
})

export class ViewChecklistComponent implements OnInit {
  task: TaskModel;
  checkListItemList: CheckListItem[] = [];
  selectedCheckListItem = '';
  constructor(
    private route: ActivatedRoute,
    private checkListManagementService: ChecklistManagementService,
    private dialog: MatDialog,
    private snackBarService: MatSnackBar,
    private dialogRef: MatDialogRef<AddOrEditChecklistDialogComponent>,
    private  messageBoxService: MessageBoxService
  ) {
  }

  ngOnInit() {

    // Retreive the prefetched article
    this.route.data.subscribe(
      (data: { article: TaskModel }) => {
        this.task = data.article;

      }
    );
    this.loadCheckList();
  }

  loadCheckList() {

    this.checkListManagementService.getCheckList(this.task.taskId, 'items').subscribe(
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
    this.dialogRef.updateSize('100%', '90%');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateNewCheckListItemClick(): void {

    const dialogConfig: MatDialogConfig = new MatDialogConfig();

    dialogConfig.data = {

      isEdit: false,
      taskId: this.task.taskId

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
      taskId: this.task.taskId,
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
          this.checkListManagementService.deleteCheckListItem(checkListItemId).subscribe({
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
