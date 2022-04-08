import {Component, Input, ViewChild} from '@angular/core';
import {UserService} from '../../core';

import {MatAccordion} from '@angular/material/expansion';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddOrEditScheduleDialogComponent} from '../schedule/add-or-edit-schedule-dialog.component';
import {CheckListItem} from '../../article/models/check-list-item.model';
import {ScheduleTaskModel} from '../models/schedule-task.model';
import {ActivatedRoute} from '@angular/router';
import {SprintModel} from '../models/sprint.model';


@Component({
  selector: 'app-sprint-preview',
  templateUrl: './sprint-preview.component.html'
})
export class SprintPreviewComponent {
 @Input() sprintList: SprintModel[];
  @Input()
  set config(sprintId: string) {
    console.log('Going to fetch data again from db for Sprint: ' + this.selectedSprint);
  }
  @ViewChild(MatAccordion) accordion: MatAccordion;
  selectedSprint: SprintModel = new SprintModel();
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
  ) {  }

  onUpdateOrScheduleNewTask(taskId: string): void {
    console.log('scheduling task ' + taskId );
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {

      isEdit: false,
      scheduleTask: this.getScheduleTask(taskId)
    };

    this.dialog.open(AddOrEditScheduleDialogComponent, dialogConfig)
      .afterClosed().subscribe(
      {
        next: (checkListItem: CheckListItem) => {

          if (checkListItem == null) { // Cancel button clicked
            return;
          }
        }
      }
    );
  }
  getScheduleTask(taskId: string): ScheduleTaskModel {
    const  scheduleTask: ScheduleTaskModel = new ScheduleTaskModel();
    scheduleTask.taskId = '23';
    scheduleTask.scheduleTaskId = '2';
    scheduleTask.description = 'blaa';
    scheduleTask.description = '';
    scheduleTask.startDate = new Date().toString();
    scheduleTask.startMinute = 5;
    scheduleTask.startHour = 3;
    scheduleTask.stopDate = '';
    scheduleTask.stopMinute = 2;
    scheduleTask.stopHour = 3;
    return scheduleTask;
  }

  onRowClick(sprint: SprintModel) {
    console.log('blaa');
  this.selectedSprint = sprint;
  }
}
