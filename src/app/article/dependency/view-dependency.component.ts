import {ActivatedRoute, Router} from '@angular/router';
import {ArticlesService, CommentsService, UserService} from '../../core';
import {ChecklistManagementService} from '../service/checklist-management.service';
import {Task} from '../models/task.model';
import {Component, Input, OnInit} from '@angular/core';
import {CheckListItem} from '../models/check-list-item.model';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {AddOrEditDependencyDialogComponent} from './add-or-edit-dependency-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ViewChecklistDialogComponent} from '../../tasks-hierarchy/tasks-l1/view-checklist-dialog.component';
import {MessageBoxService} from '../../settings/message-box.service';
import {Dependency} from '../models/dependency.model';
import {DependencyManagementService} from '../service/dependency-management.service';

@Component({
  selector: 'app-view-dependency',
  templateUrl: './view-dependency.component.html',
  styleUrls: ['../article.component.css']
})

export class ViewDependencyComponent implements OnInit {
  @Input() Type;
  task: Task;
  dependencyList: Dependency[] = [];
  selectedDependencyId = '';
  constructor(
    private route: ActivatedRoute,
    private checkListManagementService: ChecklistManagementService,
    private dialog: MatDialog,
    private snackBarService: MatSnackBar,
    private dialogRef: MatDialogRef<AddOrEditDependencyDialogComponent>,
    private  messageBoxService: MessageBoxService,
    private dependencyManagementService: DependencyManagementService
  ) {
  }

  ngOnInit() {

    // Retreive the prefetched article
    this.route.data.subscribe(
      (data: { article: Task }) => {
        this.task = data.article;

      }
    );
    this.loadDependency();
  }

  loadDependency() {
    if (this.Type === 'downstream') {
      this.dependencyManagementService.getDownstreamDependency(this.task.taskId, 'task').subscribe(
        {
          // the response is already deserialized and it is in the form of an array or object
          next: (dependencyList) => {
            this.dependencyList = dependencyList;
            console.log(this.dependencyList);
          },
          error: () => console.log('Error occured in getting Dependency List')
        });
    }

    if (this.Type === 'upstream') {
      this.dependencyManagementService.getUpstreamDependency(this.task.taskId, 'task').subscribe(
        {
          // the response is already deserialized and it is in the form of an array or object
          next: (dependencyList) => {
            this.dependencyList = dependencyList;
            console.log(this.dependencyList);
          },
          error: () => console.log('Error occured in getting Dependency List')
        });
    }
  }

  OnInit() {
    this.dialogRef.updateSize('100%', '90%');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateNewDependencyClick(): void {

    const dialogConfig: MatDialogConfig = new MatDialogConfig();

    dialogConfig.data = {

      isEdit: false,
      taskId: this.task.taskId,
      type: this.Type

    };

    this.dialog.open(AddOrEditDependencyDialogComponent, dialogConfig)
      .afterClosed().subscribe(
      {
        next: (dependency: Dependency) => {

          if (dependency == null) { // Cancel button clicked
            return;
          }

          this.loadDependency();
          this.snackBarService.open('Success. New Dependency has been  created.', '', { duration: 3000 });


        }
      }
    );
  }

  onEditDependencyClick(checkListItemId: string): void {

    const dialogConfig: MatDialogConfig = new MatDialogConfig();

    dialogConfig.data = {

      isEdit: true,
      taskId: this.task.taskId,
      type: this.Type,
      dependency : this.dependencyList.filter(x => x.dependencyId === this.selectedDependencyId)[0]

    };

    this.dialog.open(AddOrEditDependencyDialogComponent, dialogConfig)
      .afterClosed().subscribe(
      {
        next: (dependency: Dependency) => {

          if (dependency == null) { // Cancel button clicked
            return;
          }

          this.loadDependency();
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
              this.loadDependency();
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




  onRowClick(dependencyId: string): void {
    this.selectedDependencyId = dependencyId;

  }
}
