import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TaskScheduleModel} from '../models/task-schedule.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiError} from '../../settings/api-error.model';
import {TaskScheduleManagementService} from '../../Services/task-schedule-management.service';
import {AppState} from '../../app.state';
import {Store} from '@ngrx/store';
import * as TaskScheduleActions from '../../shared/store/task-schedule.action';
import {MessageBoxService} from '../../settings/message-box.service';
import {UserService} from '../../core';

@Component({
  selector: 'app-task-schedule-handler',
  templateUrl: './task-schedule-handler.component.html',
})
export class TaskScheduleHandlerComponent implements AfterViewInit, OnInit {
  @Output() newTaskScheduleList = new EventEmitter<TaskScheduleModel[]>();
  @Output() newSelectedTaskScheduleList = new EventEmitter<TaskScheduleModel[]>();
  @Output() daySummary = new EventEmitter<TaskScheduleModel[]>();
  @Input() profileId = '';
  private profileName = '';
  constructor(private route: ActivatedRoute,
              private taskScheduleManagementService: TaskScheduleManagementService,
              private store: Store<AppState>,
              private messageBoxService: MessageBoxService,
              private router: Router,
              private userService: UserService) {}



  ngOnInit(): void {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.profileId = userData.profileId; // Update  profile id and name
        this.profileName = userData.name;
        this.getAsyncTaskSchedules(this.profileId, new Date().getMonth() + 1 , new Date().getFullYear());
      }
    );
  }
  ngAfterViewInit(): void {
    this.route.queryParams.subscribe({
      next: (param) => {
        if ( param !== undefined) {
          if ( param.taskId !== undefined) {
            this.filterTaskById(param.taskId);
          }
          if ( param.month !== undefined) {
            this.addTaskByMonth(param.month, param.year);
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
          if ( param.addTaskScheduleId !== undefined) {
            this.AddNewTaskSchedule(param.addTaskScheduleId);
          }
          this.cleanQueryParams();
        }
      },
      error: () => {}
    });
  }


  // Fetch Task Schedules , Check if Schedules exist for current month , add to  to TaskScheduleList and store in Store Module
  private getAsyncTaskSchedules(profileId: string, month: number, year: number): void {
    let TaskScheduleList: TaskScheduleModel[] = [];
    if (this.checkIfSchedulesExistForMonth( month.toString(), year.toString())) {
      TaskScheduleList = this.GetTaskSchedules();
      const SelectedTaskScheduleList = TaskScheduleList.filter(function(value) { // List for Task Summary
        return new Date(value.date).getDate() === new Date().getDate();
      });
      this.newTaskScheduleList.emit(TaskScheduleList);
      this.newSelectedTaskScheduleList.emit(SelectedTaskScheduleList);
      return;
    }
    this.taskScheduleManagementService.getTaskScheduleByProfileId(profileId, month, year)
      .subscribe({
          next: (taskScheduleListForAMonth: TaskScheduleModel[]) => {
            this.store.dispatch(new TaskScheduleActions.AddAllTaskSchedule(taskScheduleListForAMonth));
            TaskScheduleList = this.GetTaskSchedules();
            const SelectedTaskScheduleList = TaskScheduleList.filter(function(value) { // List for Task Summary
              return new Date(value.date).getDate() === new Date().getDate();
            });
            this.newTaskScheduleList.emit(TaskScheduleList);
            this.newSelectedTaskScheduleList.emit(SelectedTaskScheduleList);
          },
          error: () => {}
        }
      );
  }
  private checkIfSchedulesExistForMonth(month: string, year: string): boolean {
    let TaskScheduleList: TaskScheduleModel[] = [];
    this.getTaskSchedulesFromStore(function (taskScheduleList: TaskScheduleModel[]) {
      TaskScheduleList = taskScheduleList;
    });
    const filteredTaskSchedule = TaskScheduleList.filter(function (value) {
      return ((new Date(value.date).getMonth() + 1).toString() === month &&
        new Date(value.date).getFullYear().toString() === year);
    });
    return filteredTaskSchedule.length !== 0;
  }
  private GetTaskSchedules(): TaskScheduleModel[] {
    let TaskScheduleList: TaskScheduleModel[] = [];
    this.getTaskSchedulesFromStore(function (taskScheduleList: TaskScheduleModel[]) {
      TaskScheduleList = taskScheduleList;
    });
    return TaskScheduleList;
  }
  // Update Task Summary Id in case of new task summary Id
  private updateTaskSchedule(taskScheduleId: string) {
    this.taskScheduleManagementService.getTaskScheduleById(taskScheduleId, 'taskSummary').subscribe({
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
    const TaskScheduleList = revisedTaskSchedule;
    this.newTaskScheduleList.emit(TaskScheduleList);
  }
  private addTaskByMonth(month: string, year: string) {
    this.getAsyncTaskSchedules(this.profileId, +month + 1, +year);
  }

  private getTaskScheduleListForaDate(date: string) {
    this.daySummary.emit();
    let filteredTaskSchedule: TaskScheduleModel[] = [];
    this.getTaskSchedulesFromStore(function (taskScheduleList: TaskScheduleModel[]) {
      filteredTaskSchedule = taskScheduleList.filter(function (value) {
        return (new Date(value.date).getDate().toString() === date);
      });
    });
    this.newSelectedTaskScheduleList.emit(filteredTaskSchedule);
  }
  private filterTaskById(taskId: string) {
    let FilteredTaskSchedule: TaskScheduleModel[] = [];
    if (taskId === 'all') {
      this.getTaskSchedulesFromStore(function (taskScheduleList: TaskScheduleModel[]) {
        FilteredTaskSchedule = taskScheduleList;
      });
    } else if (taskId !== undefined) {
      this.getTaskSchedulesFromStore(function (taskScheduleList: TaskScheduleModel[]) {
        FilteredTaskSchedule = taskScheduleList.filter(function (value) {
          return value.taskId === taskId;
        });
      });
    }
    this.newTaskScheduleList.emit(FilteredTaskSchedule);
  }

  // Add a Task Schedule to current task schedule
  public AddNewTaskSchedule(taskScheduleId: string) {
    let TaskScheduleList: TaskScheduleModel[] = [];
    this.taskScheduleManagementService.getTaskScheduleById(taskScheduleId).subscribe({
      next: (taskSchedule) => {
        this.store.dispatch(new TaskScheduleActions.AddTaskSchedule(taskSchedule));
        this.getTaskSchedulesFromStore(function (taskScheduleList: TaskScheduleModel[]) {
          TaskScheduleList = taskScheduleList;
        });
        this.newTaskScheduleList.emit(TaskScheduleList);
      }
      });
  }

  private cleanQueryParams() {
    this.router.navigate([], {
      queryParams: {
        'taskId': null,
        'month': null,
        'year': null,
        'date': null,
        'updateTaskScheduleId': null,
        'removeTaskScheduleId': null,
        'addTaskScheduleId': null
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


}
