import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {Article, ArticlesService, UserService} from '../core';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {CreateTaskModel} from '../shared/store/interfaces/create-task.model';
import {Task} from '../tasks-hierarchy/models/task.model';
import {getUserList} from '../shared/shared-lists/user-list';
import {error} from 'protractor';
import {DatePipe} from '@angular/common';
import * as TaskActions from '../shared/store/create-task.action';



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
  newTask: Task = new Task();
  private results: any;
  constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private userService: UserService,
    private Datepipe: DatePipe
  ) {
    // use the FormBuilder to create a form group
    this.articleForm = this.fb.group({
      title: '',
      description: '',
      body: ''
    });

    // Initialized tagList as empty array
    this.article.tagList = [];

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
        console.log('Parent Task is ' + this.newTask.parentTaskId);
      }
    });


  }

  createTask(receivedTask: CreateTaskModel): Task {
    const newTask = new Task();
    newTask.taskId = '';
    newTask.parentTaskId = receivedTask.parentTaskId === undefined ? 'dump' : receivedTask.parentTaskId ;
    newTask.description = receivedTask.description === undefined ? '' : receivedTask.description ;
    newTask.createdBy = getUserList().filter(x => x.toLowerCase()
      === this.userService.getCurrentUser().username.toLowerCase())[0];
    newTask.assignedTo =  receivedTask.assignedTo === undefined ? '' : receivedTask.assignedTo.toLowerCase() ;
    newTask.status = receivedTask.status === undefined ? 'yetToStart' : receivedTask.status;
    newTask.deadline = receivedTask.deadline === undefined ? this.Datepipe.transform
    (new Date().toLocaleDateString(), 'yyyy-MM-dd') : receivedTask.deadline ;

    newTask.positionAfter = '';
    newTask.score = 0;
    return newTask;
  }

  onAddFromTemplate(): void {
    this.router.navigateByUrl('/master');
  }

}
