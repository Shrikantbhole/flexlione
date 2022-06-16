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
import {ProfileStoreModel} from '../shared/store/interfaces/profile-store.model';
import {FormGroup} from '@angular/forms';
import {SearchQueryForm} from '../home/models/search-query-form.model';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['profile.component.css']
})

export class ProfileComponent implements OnInit, AfterViewInit {
  options: string[] = [];
  togglePlanner = 'day';
  TaskScheduleList: TaskScheduleModel[] = [];
  SelectedTaskScheduleList: TaskScheduleModel[] = []; // Shortlisted for seeing detail detail summary
  sprintList: SprintModel[] = [];
  profileId ;
  profileName = '';
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
  ) {}

  profile: Profile;
  currentUser: User;

   ngOnInit() {
     /*
    // Store TaskModel Dump in @ngrx/Store
     this.route.data.subscribe(
      (data: { profile: SearchTaskViewStoreModel[] }) => {
        this.store.dispatch(new TaskActions.RemoveSearchTask()); // Clear Old Store Dump
        this.store.dispatch(new TaskActions.AddSearchTask(data.profile)); // Add new Dump for Profile id
      });
      */
     this.userService.currentUser.subscribe(
       (userData) => {
         this.profileId = userData.profileId; // Update  profile id and name
         this.profileName = userData.name;
         this.updateSprintList(this.profileId);
       }
     );
     this.parentForm.controls['assignedTo'].setValue( // cannot edit Owner on search Task filter
       this.GetProfileName(this.profileId)
     );
     this.parentForm.controls['assignedTo'].disable();
   }
  ngAfterViewInit(): void {
    this.updateSprintList(this.profileId);
    this.profileManagementService.getAllProfiles()
      .subscribe({
        next : (profiles) => {
          this.Profiles = profiles;
          this.profileName = this.GetProfileName(this.profileId);
          for (let i = 0; i <   this.Profiles.length; i++ ) {
            this.options.push( this.Profiles[i].name);
          }
        },
        error : () => {}
      });
  }
  public async updateProfile(profileName: string) {
     this.profileId = await this.GetProfileId(profileName);
     this.profileName = this.GetProfileName(this.profileId);
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
    // Fetch Sprint list
    this.updateSprintList(this.profileId); // Asynchronously Update Sprint lIST
  }
  onPlanDay() {
    this.togglePlanner = 'day';
  }

  public onDaySummary() {
    this.togglePlanner = 'summary';
  }

  public  updateTaskScheduleList(taskScheduleList: TaskScheduleModel[]) {
     const newTaskScheduleList: TaskScheduleModel[] = [];
     taskScheduleList.forEach(function (taskSchedule) {
       newTaskScheduleList.push(taskSchedule);
     });
     this.TaskScheduleList = newTaskScheduleList;
  }
  public  updateSelectedTaskScheduleList(selectedTaskScheduleList: TaskScheduleModel[]) {
    const newSelectedTaskScheduleList: TaskScheduleModel[] = [];
    selectedTaskScheduleList.forEach(function (taskSchedule) {
      newSelectedTaskScheduleList.push(taskSchedule);
    });
     this.SelectedTaskScheduleList = newSelectedTaskScheduleList;
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
