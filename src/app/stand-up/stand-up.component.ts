import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Article, ArticlesService, UserService} from '../core';
import {ProfileStoreModel} from '../shared/store/interfaces/profile-store.model';
import {DailyPlanSummaryService} from '../Services/daily-plan-summary.service';
import {TaskSummaryModel} from '../profile/models/task-summary.model';
import {ApiError} from '../settings/api-error.model';
import {MessageBoxService} from '../settings/message-box.service';
import {ProfileManagementService} from '../Services/profile-management.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CreateTaskForm} from '../article/models/task-detail.form';
import {DatePipe} from '@angular/common';
import {map, startWith} from 'rxjs/operators';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';




@Component({
  selector: 'app-stand-up-page',
  templateUrl: './stand-up.component.html',
  styleUrls: ['stand-up.component.css']
})
export class StandUpComponent implements OnInit {
  public TaskSummaryList: TaskSummaryModel[] = [];
  public Profiles: ProfileStoreModel[] = [];
  options: string[] = [];
  public profileId: string;
  public Name = 'anuj';
  date = new FormControl({value: new Date()}, Validators.required);

  constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router,
    private dailyPlanSummaryService: DailyPlanSummaryService,
    private  messageBoxService: MessageBoxService,
    private  profileManagementService: ProfileManagementService,
    private datePipe: DatePipe
  ) {
  }

  async ngOnInit() {
    await this.getAllProfiles();
    console.log(this.date.value);
    this.GetDailyTaskSummary('2', this.datePipe.transform(this.date.value.value, 'yyyy-MM-dd'));
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    this.GetDailyTaskSummary(this.profileId, this.datePipe.transform(event.value, 'yyyy-MM-dd'));

  }

  private  GetDailyTaskSummary(profileId: string, date: string) {
    this.dailyPlanSummaryService.getDailyTaskSummary(profileId, date).subscribe({
      next : (taskSummaryList) => {
        this.TaskSummaryList = taskSummaryList;
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
  onAddFromTemplate(): void {
    this.router.navigateByUrl('/master');
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

  public async updateProfile(profileName: string) {
    this.profileId = await this.GetProfileId(profileName);
    this.Name = this.GetProfileName(this.profileId);
    this.GetDailyTaskSummary(this.profileId,  this.datePipe.transform(this.date.value, 'yyyy-MM-dd'));
  }

}
