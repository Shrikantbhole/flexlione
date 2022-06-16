import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {SearchTaskViewStoreModel} from '../store/interfaces/search-task-view-store.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import {ProfileStoreModel} from '../store/interfaces/profile-store.model';
import {ProfileManagementService} from '../../Services/profile-management.service';
import {TaskModel} from '../../article/models/task-detail.model';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddOrEditScheduleDialogComponent} from '../../profile/schedule/add-or-edit-schedule-dialog.component';
import {TaskScheduleModel} from '../../profile/models/task-schedule.model';
import {TaskHierarchyManagementService} from '../../Services/task-hierarchy-management.service';
import {TaskHierarchyModel} from '../../article/models/task-hierarchy.model';
import {Router} from '@angular/router';
import {TaskScheduleManagementService} from '../../Services/task-schedule-management.service';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html',
  styleUrls: ['../../app.component.css']
})
export class ArticlePreviewComponent {
  constructor( private profileManagementService: ProfileManagementService,
               private dialog: MatDialog,
               private  taskHierarchyManagementService: TaskHierarchyManagementService,
               private taskScheduleManagementService: TaskScheduleManagementService) {}
  @Output() newScheduleEvent  = new EventEmitter<TaskScheduleModel>();
  @Input() SearchTask: SearchTaskViewStoreModel;
  @Input() Profiles: ProfileStoreModel[];

 // public Profiles: ProfileStoreModel[] = [];
  public TaskHierarchy: TaskHierarchyModel;
  currentDate = new Date().toISOString();




  onUpdateOrScheduleNewTask(task): void {
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

  getTaskHierarchy(): void {
    this.taskHierarchyManagementService.getTaskHierarchyByTaskId(this.SearchTask.taskId, '', this.onSuccess);

  }
  public onSuccess = (taskHierarchy: TaskHierarchyModel) => {
    this.TaskHierarchy = taskHierarchy;
    this.TaskHierarchy.childrenTaskIdList = this.TaskHierarchy.childrenTaskIdList.reverse();
  }
}
