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
import {TaskModel} from '../article/models/task-detail.model';
import {TaskScheduleModel} from '../profile/models/task-schedule.model';




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
  public currentTaskSummary;
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
    console.log(this.datePipe.transform(event.value, 'yyyy-MM-dd'));
  }

  private  GetDailyTaskSummary(profileId: string, date: string) {
    this.dailyPlanSummaryService.getDailyTaskSummary(profileId, date).subscribe({
      next : (taskSummaryList) => {
        this.TaskSummaryList = taskSummaryList;
        this.totalExpectedHr = 0;
        this.TaskSummaryList.forEach(item => { if (item.taskSchedule.isPlanned === true) {this.totalExpectedHr += item.expectedHour; } });
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

  onClickStart(taskSummary: TaskSummaryModel) {
    const newTaskSummary: TaskSummaryModel = {
      systemHours: taskSummary.systemHours,
      task: taskSummary.task,
      taskSchedule: taskSummary.taskSchedule,
      taskSummaryId : taskSummary.taskSummaryId,
      taskScheduleId : taskSummary.taskScheduleId,
      taskId : taskSummary.taskId,
      stamp: new Date().toLocaleTimeString(),
      action: 'start'
    };
console.log(newTaskSummary);
    this.dailyPlanSummaryService.UpdateDailyTaskActualTime(this.profileId, newTaskSummary)
      .subscribe({
        next: (summary) => {
          this.snackBarService.open('Task Summary ' + summary[0].taskSummaryId + ' started at ' + summary[0].stamp.slice(11 , 19), '' , {duration: 3000});
          console.log(summary);
          this.GetDailyTaskSummary(this.profileId, summary[0].stamp.slice(0 , 10));
          // console.log()
          },
        error: (apiError: ApiError) => {this.messageBoxService.info('Task summary not updated', apiError.title, apiError.detail); }
      });

  }
  onClickStop(taskSummary: TaskSummaryModel) {
    const newTaskSummary: TaskSummaryModel = {
      systemHours: taskSummary.systemHours,
      task: taskSummary.task,
      taskSchedule: taskSummary.taskSchedule,
      taskSummaryId : taskSummary.taskSummaryId,
      taskScheduleId : taskSummary.taskScheduleId,
      taskId : taskSummary.taskId,
      stamp: new Date().toLocaleTimeString(),
      action: 'stop'
    };
    console.log(newTaskSummary);
    this.dailyPlanSummaryService.UpdateDailyTaskActualTime(this.profileId, newTaskSummary)
      .subscribe({
        next: (Summary) => {
          this.snackBarService.open('Task Summary ' + Summary[0].taskSummaryId + ' stopped at ' + Summary[0].stamp.slice(11 , 19), '' , {duration: 3000});
          console.log(Summary[0].stamp);
          this.GetDailyTaskSummary(this.profileId, Summary[0].stamp.slice(0 , 10));
        },
        error: (apiError: ApiError) => {this.messageBoxService.info('Task summary not updated', apiError.title, apiError.detail); }
      });
  }

  public selectTaskSummary(event: any, item: TaskSummaryModel) {

    this.currentTaskSummary = item.taskSummaryId;
  }
}
