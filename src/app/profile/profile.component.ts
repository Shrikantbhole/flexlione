import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {User, UserService, Profile} from '../core';
import {MatAccordion} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import {TaskScheduleModel} from './models/task-schedule.model';
import {SprintModel} from './models/sprint.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as TaskActions from '../shared/store/search-task.action';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {SearchTaskViewStoreModel} from '../shared/store/interfaces/search-task-view-store.model';
import {ProfileManagementService} from '../Services/profile-management.service';
import {SearchFormComponent} from '../home/Search/search-form.component';
import {ProfileStoreModel} from '../shared/store/interfaces/profile-store.model';
import {TaskScheduleManagementService} from '../Services/task-schedule-management.service';
import * as TaskScheduleActions from '../shared/store/task-schedule.action';
import {ApiError} from '../settings/api-error.model';
import {MessageBoxService} from '../settings/message-box.service';
import {FormGroup} from '@angular/forms';
import {SearchQueryForm} from '../home/models/search-query-form.model';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['profile.component.css']
})

export class ProfileComponent implements OnInit, AfterViewInit {
  options: string[] = [];
  togglePlanner = 'sprint';
  TaskScheduleList: TaskScheduleModel[] = [];
  SelectedTaskScheduleList: TaskScheduleModel[] = []; // Shortlisted for seeing detail detail summary
  sprintUpdateCounter = 0;
  sprintList: SprintModel[] = [];
  profileId ;
  profileName;
  parentForm: FormGroup = SearchQueryForm();
  public Profiles: ProfileStoreModel[] = [];
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBarService: MatSnackBar,
    private router: Router,
    private store: Store<AppState>,
    private profileManagementService: ProfileManagementService,
    private searchFormComponent: SearchFormComponent,
    private taskScheduleManagementService: TaskScheduleManagementService,
    private messageBoxService: MessageBoxService
  ) {}

  profile: Profile;
  currentUser: User;
  isUser: boolean;

  async ngOnInit() {
    // Update Options list to shift to another profile
    await this.getAllProfiles();
    // Store TaskModel Dump in @ngrx/Store
    this.route.data.subscribe(
      (data: { profile: SearchTaskViewStoreModel[] }) => {
        this.store.dispatch(new TaskActions.RemoveSearchTask()); // Clear Old Store Dump
        for ( let i = 0; i < data.profile.length; i++) {
          // Add Task Search result in Store
          this.store.dispatch(new TaskActions.AddSearchTask(data.profile[i]));
        }
        this.profileId = data.profile[0].assignedTo;  // Get Profile Id
         this.parentForm.controls['assignedTo'].setValue(
            this.GetProfileName(this.profileId)
        );
         this.profileName = this.GetProfileName(this.profileId);
        this.parentForm.controls['assignedTo'].disable();
        this.updateSprintList(this.profileId); // Asynchronously Update Sprint lIST
        // This component will handle storing of task schedules and
        // send relevant schedules to calendar component
        this.getAsyncTaskSchedules(this.profileId, new Date().getMonth() + 1 , new Date().getFullYear());
      }
    );
  }
  // Fetch Task Schedules , bind to TaskScheduleList and store in Store Module
  private getAsyncTaskSchedules(profileId: string, month: number, year: number): void {
    this.taskScheduleManagementService.getTaskScheduleByProfileId(profileId, month, year)
      .subscribe({
        next: (taskScheduleList) => {
         this.TaskScheduleList = taskScheduleList;
         this.SelectedTaskScheduleList = taskScheduleList.filter(function(value) { // List for Task Summary
           return new Date(value.date).getDate() === new Date().getDate();
         });
         this.store.dispatch(new TaskScheduleActions.RemoveAllTaskSchedule()) ;
         for ( let i = 0; i < taskScheduleList.length; i++) {
            // Add Task Schedules in Store
            this.store.dispatch(new TaskScheduleActions.AddTaskSchedule(taskScheduleList[i]));
          }
        },
        error: () => {}
      });
  }
// Add a Task Schedule to current task schedule
  public AddNewTaskSchedule(taskScheduleModel: TaskScheduleModel) {
    const newTaskScheduleList: TaskScheduleModel[] = [];
    newTaskScheduleList.push(taskScheduleModel);
    this.TaskScheduleList.forEach(function (taskSchedule) {
      newTaskScheduleList.push(taskSchedule);
    });
    this.TaskScheduleList = newTaskScheduleList;
    this.store.dispatch(new TaskScheduleActions.AddTaskSchedule(taskScheduleModel));
  }
  public async updateProfile(profileName: string) {
    this.profileId = await this.GetProfileId(profileName);
    this.updateSprintList(this.profileId);
    this.router.navigateByUrl('/profile/' + this.profileId);
  }
  public updateSprintList(profileId: string) {
    this.profileManagementService.getProfileById(profileId, 'sprint')
      .subscribe({
        next: (profile) => {
          this.sprintList = profile.sprints;
        },
        error: () => {}
      });
  }


  getSprintIds(): string[] {
    const sprintIds: string[] = [];
    this.sprintList.forEach(function(value) {
      sprintIds.push(value.sprintId);
  });
  return sprintIds;
  }
  onSearchTasks() {
    this.togglePlanner = 'search';
  }
  onPlanSprint() {
    this.togglePlanner = 'sprint';
  }
  onPlanDay() {
    this.togglePlanner = 'day';
  }

  public onDaySummary() {
    this.togglePlanner = 'summary';
  }
  async getAllProfiles() {
    this.Profiles = await this.profileManagementService.getAllProfiles().toPromise();
    for (let i = 0; i <   this.Profiles.length; i++ ) {
            this.options.push( this.Profiles[i].name);
          }
  }
  ngAfterViewInit(): void {
    this.route.queryParams.subscribe({
      next: (param) => {
        if ( param !== undefined) {
          if ( param.taskId !== undefined) {
          this.filterTaskById(param.taskId);
          }
          if ( param.month !== undefined) {
           this.filterTaskByMonth(param.month, param.year);
          }
          if ( param.date !== undefined) {
            this.getTaskScheduleListForaDate(param.date);
          }
          if ( param.updateTaskScheduleId !== undefined) {
           this.updateTaskSchedule(param.updateTaskScheduleId);
          }
          if ( param.removeTaskScheduleId !== undefined) {
            this.removeTaskSchedule(param.removeTaskScheduleId);
          }
          this.cleanQueryParams();
        }
      },
      error: () => {}
    });
  }

  // Update Task Summary Id in case of new task summary Id
  private updateTaskSchedule(taskScheduleId: string) {
    this.taskScheduleManagementService.getTaskScheduleById(taskScheduleId).subscribe({
      next: (taskSchedule) => {
        this.store.dispatch(new TaskScheduleActions.RemoveTaskSchedule(taskScheduleId));
        this.store.dispatch(new TaskScheduleActions.AddTaskSchedule(taskSchedule));
        this.getTaskScheduleListForaDate(new Date(taskSchedule.date).getDate().toString());
      },
      error: (apiError: ApiError) => {
        this.messageBoxService.info('Error in getting task Id', apiError.title, apiError.detail);
      }
    });
  }
  private removeTaskSchedule(taskScheduleId: string) {
    this.store.dispatch(new TaskScheduleActions.RemoveTaskSchedule(taskScheduleId));
    let revisedTaskSchedule: TaskScheduleModel[] = [];
    this.getTaskSchedulesFromStore(function (taskScheduleList) {
      revisedTaskSchedule = taskScheduleList;
    });
    this.TaskScheduleList = revisedTaskSchedule;
  }
  private filterTaskByMonth(month: string, year: string) {
    let filteredTaskSchedule: TaskScheduleModel[] = [];
    this.getTaskSchedulesFromStore(function (taskScheduleList: TaskScheduleModel[]) {
      filteredTaskSchedule = taskScheduleList.filter(function (value) {
        return (new Date(value.date).getMonth().toString() === month &&
          new Date(value.date).getFullYear().toString() === year);
      });
    });
    if (filteredTaskSchedule.length === 0) {
      this.getAsyncTaskSchedules(this.profileId, +month + 1, +year);
    } else {
      this.TaskScheduleList = filteredTaskSchedule;
    }
  }

  private getTaskScheduleListForaDate(date: string) {
    this.onDaySummary();
    let filteredTaskSchedule: TaskScheduleModel[] = [];
    this.getTaskSchedulesFromStore(function (taskScheduleList: TaskScheduleModel[]) {
       filteredTaskSchedule = taskScheduleList.filter(function (value) {
        return (new Date(value.date).getDate().toString() === date);
      });
    });
    this.SelectedTaskScheduleList = filteredTaskSchedule;
  }
   private filterTaskById(taskId: string) {
    let filteredTaskSchedule: TaskScheduleModel[] = [];
    if (taskId === 'all') {
      this.getTaskSchedulesFromStore(function (taskScheduleList: TaskScheduleModel[]) {
        filteredTaskSchedule = taskScheduleList;
      });
    } else if (taskId !== undefined) {
      this.getTaskSchedulesFromStore(function (taskScheduleList: TaskScheduleModel[]) {
        filteredTaskSchedule = taskScheduleList.filter(function (value) {
          return value.taskId === taskId;
        });
      });
    }
    this.TaskScheduleList = filteredTaskSchedule;
  }

  private cleanQueryParams() {
    this.router.navigate([], {
      queryParams: {
        'taskId': null,
        'month': null,
        'year': null,
        'date': null,
        'updateTaskScheduleId': null,
        'removeTaskScheduleId': null
      },
      queryParamsHandling: 'merge'
    });
  }
  private getTaskSchedulesFromStore(callback: (taskScheduleList: TaskScheduleModel[]) => any) {
    this.store.select('taskSchedule')
      .subscribe({
        next: (taskSchedules) => {
          callback(taskSchedules);
        },
        error: () => {}
      });
  }
  public  GetProfileId(profileName: string): string {
    const profile = this.Profiles.filter(function (value) {
      return (value.name === profileName);
    });
    return profile[0] === undefined ? profileName : profile[0].profileId;
  }

  public  GetProfileName(profileId: string): string {
    const profile = this.Profiles.filter(function (value) {
      return (value.profileId === profileId);
    });
    return profile[0] === undefined ? profileId : profile[0].name;
  }


}
