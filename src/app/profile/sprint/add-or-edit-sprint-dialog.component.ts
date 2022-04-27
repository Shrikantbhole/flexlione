import {Component, Inject, OnInit} from '@angular/core';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MessageBoxService } from '../../settings/message-box.service';
import {DatePipe} from '@angular/common';
import {SprintModel} from '../models/sprint.model';
import {ApiError} from '../../settings/api-error.model';
import {SprintManagementService} from '../../Services/sprint-management.service';
import {getUserList} from '../../shared/shared-lists/user-list';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import {ProfileStoreModel} from '../../shared/store/interfaces/profile-store.model';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-or-edit-sprint-dialog',
  templateUrl: './add-or-edit-sprint-dialog.component.html',
  styleUrls: ['../profile.component.css']
})
export class AddOrEditSprintDialogComponent implements OnInit {
  public  UserList: string[] = getUserList();
  private messageBoxService: MessageBoxService;
  public isEdit: boolean ;
  public taskId: string;
  private Profiles: ProfileStoreModel[];
  // members for data-binding
  newSprint: FormGroup = new FormGroup({
    'sprintId': new FormControl('', [Validators.required]),
    'owner': new FormControl(''),
    'fromDate': new FormControl(''),
    'toDate': new FormControl(''),
    'score': new FormControl(''),
    'description': new FormControl(''),
    'deliverable': new FormControl(''),
    'delivered': new FormControl('')
  });
  constructor(private datepipe: DatePipe, public dialogRef: MatDialogRef<AddOrEditSprintDialogComponent>,
              messageBoxService: MessageBoxService, @Inject(MAT_DIALOG_DATA) data,
              private  store: Store<AppState>,  private sprintManagementService: SprintManagementService,
              private  snackBarService: MatSnackBar) {
    this.messageBoxService = messageBoxService;
    // Need to toggle Add/Update Button on Form
    this.isEdit = data.isEdit;
    // Get Profile List from the store
    this.store.select('profile')
      .subscribe({ next: (profiles) => {
          this.Profiles = profiles;
        },
        error: () => {}
      });
    // members for data-binding
    this.newSprint.setValue({
      sprintId:  data.sprint.sprintId === undefined ? 'serverGenerated' : data.sprint.sprintId  ,
      owner: data.sprint.owner === undefined ? '' : this.GetProfileName(data.sprint.owner),
      fromDate: new Date(data.sprint.fromDate),
      toDate: new Date(data.sprint.toDate),
      description: data.sprint.description === undefined ? '' : data.sprint.description,
      score: data.sprint.score === undefined ? '' : data.sprint.score,
      deliverable: data.sprint.deliverable === undefined ? '' : data.sprint.deliverable,
      delivered: data.sprint.delivered === undefined ? '' : data.sprint.delivered
    });
    this.newSprint.controls['sprintId'].disable();
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('50%', '70%');
  }
    onNoClick(): void {
    this.dialogRef.close();
  }
  onAddOrUpdate(): void {

    this.sprintManagementService.AddOrUpdateSprint(this.createSprint(this.newSprint))
      .subscribe({

        next: (sprint) => {
          this.snackBarService.open('Sprint successfully created', '', {duration: 300});
          this.dialogRef.close(sprint);
        },
        error: (apiError: ApiError) => {
          this.messageBoxService.info('Error: Sprint not created .', apiError.title, apiError.detail);
        }
      });
  }

  createSprint(newSprint: FormGroup): SprintModel {
    const sprint = new SprintModel();
    sprint.sprintId = newSprint.getRawValue().sprintId;
    sprint.description = newSprint.getRawValue().description;
    sprint.owner = this.GetProfileId(newSprint.getRawValue().owner);
    sprint.fromDate =  this.datepipe.transform(newSprint.getRawValue().fromDate, 'yyyy-MM-dd');
    sprint.toDate = this.datepipe.transform(newSprint.getRawValue().toDate, 'yyyy-MM-dd');
    sprint.deliverable = newSprint.getRawValue().deliverable;
    sprint.delivered = newSprint.getRawValue().delivered;
    return sprint;
  }

   GetProfileId(profileName: string): string {
    const profile = this.Profiles.filter(function (value) {
      return (value.name === profileName);
    });
    return profile[0] === undefined ? profileName : profile[0].profileId;
  }

   GetProfileName(profileId: string): string {
    const profile = this.Profiles.filter(function (value) {
      return (value.profileId === profileId);
    });
    return profile[0] === undefined ? profileId : profile[0].name;
  }
}

