import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Article, ArticlesService, UserService} from '../core';
import {ProfileStoreModel} from '../shared/store/interfaces/profile-store.model';
import {DailyPlanSummaryService} from '../Services/daily-plan-summary.service';
import {CreateTaskSummaryForm, TaskSummaryModel} from '../profile/models/task-summary.model';
import {ApiError} from '../settings/api-error.model';
import {MessageBoxService} from '../settings/message-box.service';
import {ProfileManagementService} from '../Services/profile-management.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CreateTaskForm} from '../article/models/task-detail.form';
import {DatePipe} from '@angular/common';
import {map, startWith} from 'rxjs/operators';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {ProfileModel} from '../profile/models/profile.model';
import {TimeStampModel} from '../profile/models/time-stamp.model';
import {Timestamp} from 'rxjs/internal-compatibility';
import {MatSnackBar} from '@angular/material/snack-bar';




@Component({
  selector: 'app-stand-up-page',
  templateUrl: './stand-up.component.html',
  styleUrls: ['stand-up.component.css']
})
export class StandUpComponent implements OnInit {
  constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router,
    private dailyPlanSummaryService: DailyPlanSummaryService,
    private  messageBoxService: MessageBoxService,
    private  profileManagementService: ProfileManagementService,
    private datePipe: DatePipe,
    private userService: UserService,
    private  snackBarService: MatSnackBar,
  ) {
  }
  public TaskSummaryList: TaskSummaryModel[] = [];
  public Profiles: ProfileStoreModel[] = [];
  options: string[] = [];
  public profileId: string;
  public Name: string ;
  newDate: FormGroup = new FormGroup({
    newDate1: new FormControl(new Date(), [Validators.required]),
  });
  currentUser: ProfileModel;
  totalExpectedHr = 0;
  totalActualHr = 0;
startStamp: TimeStampModel;
stopStamp: TimeStampModel;
/*
  onClickStart(taskSummary) {
    this.startStamp = {profileId : this.profileId,
      taskSummaryId : taskSummary.taskSummaryId,
      taskScheduleId : taskSummary.taskScheduleId,
      stamp: new Date().toLocaleString(),
      action : 'start'};
    console.log(this.startStamp);
  }
*/
  newTaskSummary: FormGroup = CreateTaskSummaryForm();

  async ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
        this.Name = this.currentUser.name;
        this.profileId = this.currentUser.profileId;
      }
    );
    this.GetDailyTaskSummary(this.currentUser.profileId, this.datePipe.transform(this.newDate.getRawValue().newDate1, 'yyyy-MM-dd'));
    await this.getAllProfiles();
  }

  onDateChange(event: MatDatepickerInputEvent<Date | null>) {
    console.log(event.value);
    this.GetDailyTaskSummary(this.profileId, this.datePipe.transform(event.value, 'yyyy-MM-dd'));

  }

  private  GetDailyTaskSummary(profileId: string, date: string) {
    this.dailyPlanSummaryService.getDailyTaskSummary(profileId, date).subscribe({
      next : (taskSummaryList) => {
        this.TaskSummaryList = taskSummaryList;
        this.totalExpectedHr = 0;
        this.TaskSummaryList.forEach(item => { this.totalExpectedHr += item.expectedHour; });
        this.totalActualHr = 0;
        this.TaskSummaryList.forEach(item => { this.totalActualHr += item.actualHour; });

      },
      error : (apiError: ApiError) => {this.messageBoxService.info('Error in getting Task Summary List', apiError.title, apiError. detail);
      }
    });
  }

  async getAllProfiles() {
   this.Profiles = await this.profileManagementService.getAllProfiles().toPromise();
   for (let i = 0; i <   this.Profiles.length; i++ ) {
      this.options.push( this.Profiles[i].name);
    }
  }
  private GetProfileName(profileId: string): string {
    const profile = this.Profiles.filter(function (value) {
      return (value.profileId === profileId);
    });
    return profile[0] === undefined ? profileId : profile[0].name;
  }
  private GetProfileId(profileName: string): string {
    const profile = this.Profiles.filter(function (value) {
      return (value.name === profileName);
    });
    return profile[0] === undefined ? profileName : profile[0].profileId;
  }

  public  updateProfile(profileName: string) {
    this.profileId =  this.GetProfileId(profileName);
    this.Name = this.GetProfileName(this.profileId);
    this.GetDailyTaskSummary(this.profileId,  this.datePipe.transform(this.newDate.getRawValue().newDate1, 'yyyy-MM-dd'));
  }
  onClickStart() {
  }
  onClickStop() {
  }
}
