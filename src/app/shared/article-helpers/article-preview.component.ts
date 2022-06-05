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

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html'
})
export class ArticlePreviewComponent implements OnChanges {
  @Output() newScheduleEvent  = new EventEmitter<TaskScheduleModel>();
  @Input() SearchTask: SearchTaskViewStoreModel;
  @Input() Profiles: ProfileStoreModel[];
  sprintList: string[] = ['23', '24'];

 // public Profiles: ProfileStoreModel[] = [];
  public TaskHierarchy: TaskHierarchyModel;
  constructor( private profileManagementService: ProfileManagementService, private dialog: MatDialog, private  taskHierarchyManagementService: TaskHierarchyManagementService,
  ) {
   // this.GetProfiles();
  }


 // constructor( private profileManagementService: ProfileManagementService) {}
  public GetProfileName(profileId: string): string {
   let profile = [];
    if (this.Profiles !== undefined) {
     profile = this.Profiles.filter(function (value) {
       return (value.profileId === profileId);
     });
   }
   return profile[0] === undefined ? profileId : profile[0].name;
  }

  onUpdateOrScheduleNewTask(task): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      task : task
    };

    this.dialog.open(AddOrEditScheduleDialogComponent, dialogConfig)
      .afterClosed().subscribe({
      next: (taskSchedule: TaskScheduleModel) => {
        if (taskSchedule !== undefined) {
          this.newScheduleEvent.emit(taskSchedule);
        }
      },
      error: () => {}
    });
  }

  ngOnChanges(): void {
    this.taskHierarchyManagementService.getTaskHierarchyByTaskId(this.SearchTask.taskId, '', this.onSuccess);

  }
  public onSuccess = (taskHierarchy: TaskHierarchyModel) => {
    this.TaskHierarchy = taskHierarchy;
  }
}
