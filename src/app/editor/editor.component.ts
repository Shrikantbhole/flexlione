import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {Article, ArticlesService, UserService} from '../core';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {CreateTaskStoreModel} from '../shared/store/interfaces/create-task-store.model';
import {TaskModel} from '../article/models/taskModel';
import {getUserList} from '../shared/shared-lists/user-list';
import {error} from 'protractor';
import {DatePipe} from '@angular/common';
import * as TaskActions from '../shared/store/create-task.action';
import {ProfileStoreModel} from '../shared/store/interfaces/profile-store.model';



@Component({
  selector: 'app-editor-page',
  templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit {
  article: Article = {} as Article;
  articleForm: FormGroup;
  tagField = new FormControl();
  errors: Object = {};
  isSubmitting = false;
  newTask: TaskModel = new TaskModel();
  private Profiles: ProfileStoreModel[] = [];

  constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private userService: UserService,
    private datePipe: DatePipe
  ) {
    this.store.select('profile')
      .subscribe({ next: (profiles) => {
          this.Profiles = profiles;
        },
        error: () => {}
      });

    // Optional: subscribe to value changes on the form
    // this.articleForm.valueChanges.subscribe(value => this.updateArticle(value));
  }

  ngOnInit() {
    const user = this.userService.getCurrentUser().username.toLowerCase();
    this.store.select('createTask').subscribe({
      next: (x) => {
        if (x === undefined) {
          return;
        }
        this.newTask = this.createTask(x[0]);
        console.log('Parent TaskModel is ' + this.newTask.parentTaskId);
      }
    });


  }

  createTask(receivedTask: CreateTaskStoreModel): TaskModel {
    const newTask = new TaskModel();
    newTask.taskId = '';
    newTask.parentTaskId = receivedTask.parentTaskId === undefined ? '0' : receivedTask.parentTaskId ;
    newTask.description = receivedTask.description === undefined ? '' : receivedTask.description ;
    newTask.createdBy = getUserList().filter(x => x.toLowerCase()
      === this.userService.getCurrentUser().username.toLowerCase())[0];
    newTask.assignedTo =  receivedTask.assignedTo === undefined ? '' : this.GetProfileName(receivedTask.assignedTo) ;
    newTask.status = receivedTask.status === undefined ? 'yetToStart' : receivedTask.status;
    newTask.deadline = receivedTask.deadline === undefined ? this.datePipe.transform
    (new Date().toLocaleDateString(), 'yyyy-MM-dd') : receivedTask.deadline ;

    newTask.positionAfter = '';
    newTask.score = 0;
    return newTask;
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

}
