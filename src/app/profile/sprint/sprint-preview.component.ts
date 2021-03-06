import {Component, Input, Output, ViewChild, EventEmitter, OnInit} from '@angular/core';
import {UserService} from '../../core';

import {MatAccordion} from '@angular/material/expansion';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddOrEditScheduleDialogComponent} from '../schedule/add-or-edit-schedule-dialog.component';
import { TaskScheduleModel} from '../models/task-schedule.model';
import {ActivatedRoute, Router} from '@angular/router';
import {SprintModel} from '../models/sprint.model';
import {AddOrEditSprintDialogComponent} from './add-or-edit-sprint-dialog.component';
import {SprintManagementService} from '../../Services/sprint-management.service';
import {TaskModel} from '../../article/models/task-detail.model';
import {TaskManagementService} from '../../Services/task-management-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProfileModel} from '../models/profile.model';
import {TaskScheduleManagementService} from '../../Services/task-schedule-management.service';



@Component({
  selector: 'app-sprint-preview',
  templateUrl: './sprint-preview.component.html'
})
export class SprintPreviewComponent implements OnInit {
 @Input() sprintList: SprintModel[];
 @Output() newItemEvent  = new EventEmitter<string>();
  @ViewChild(MatAccordion) accordion: MatAccordion;
  public currentUser: ProfileModel;
  public selectedSprint: SprintModel = new SprintModel();
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
    private sprintManagementService: SprintManagementService,
    private router: Router,
    private taskManagementService: TaskManagementService,
    private snackBarService: MatSnackBar,
    private  taskScheduleManagementService: TaskScheduleManagementService
  ) {  }

  ngOnInit() {
    // Load the current user's data
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );
    }

  onUpdateOrScheduleNewTask(task: TaskModel): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      task : task
    };

    this.dialog.open(AddOrEditScheduleDialogComponent, dialogConfig)
      .afterClosed().subscribe({
      next: (taskSchedule: TaskScheduleModel) => {
        if (taskSchedule !== undefined) {
          this.taskScheduleManagementService.emitTaskSchedule(taskSchedule);
        }
        },
      error: () => {}
    });
  }
  onRowClick(sprint: SprintModel) {
    this.selectedSprint = sprint;
    this.GetTaskList(sprint.sprintId);
  }
  GetTaskList(sprintId: string) {
    this.sprintManagementService.getSprintById(sprintId, 'task')
      .subscribe({
        next: (sprint) => {
          this.selectedSprint.tasks = sprint.tasks;
        },
        error: () => {}
      });
  }
  onAddOrEditSprint( isEdit: boolean, sprint?: SprintModel) {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    const newSprint: SprintModel = new SprintModel();
    newSprint.owner = this.currentUser.profileId;
    dialogConfig.data = {

      isEdit: isEdit,
      sprint: sprint === undefined ? newSprint : sprint
    };
    this.dialog.open(AddOrEditSprintDialogComponent, dialogConfig).afterClosed().subscribe(
      {
        next: (newSprintModel: SprintModel) => {
          console.log('Added Sprint: ' + newSprintModel);
          this.newItemEvent.emit(newSprintModel.owner);
        },
        error: () => {}
      }
    );

  }

  onShowSchedulesForTask(taskId: string): void {
    this.router.navigateByUrl(this.router.url + '?taskId=' + taskId);
    // Remove query params
  }

  onRemoveTaskFromSprint(task: TaskModel): void {
    this.taskManagementService.removeTaskFromSprint(task.taskId, this.onSuccess);
  }

  onSuccess = (task: TaskModel)  => {
    this.snackBarService.open('Task Successfully removed from sprint', '', {duration: 300});
  }
}
