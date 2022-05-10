import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import {TaskModel} from './models/task-detail.model';


import {
  ArticlesService,
  CommentsService,
  User,
  UserService
} from '../core';

import {TaskManagementService} from '../Services/task-management-service';
import {MessageBoxService} from '../settings/message-box.service';
import {CommentManagementService} from '../Services/comment-management.service';
import {TaskComment} from './models/task-comment.model';
import {DatePipe} from '@angular/common';
import {CreateTaskForm, GetTaskFormFromTaskModel} from './models/task-detail.form';
import {TaskHierarchyManagementService} from '../Services/task-hierarchy-management.service';
import {TaskHierarchyModel} from './models/task-hierarchy.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProfileModel} from '../profile/models/profile.model';

@Component({
  selector: 'app-article-page',
  templateUrl: './article.component.html',
  styleUrls: ['article.component.css']
})
export class ArticleComponent implements OnInit {
  task: TaskModel;
  currentUser: ProfileModel;
  canModify: boolean;
  comments: TaskComment[] = [];
  commentControl = new FormControl();
  commentFormErrors = {};
  isSubmitting = false;
  isDeleting = false;
  selectedCheckListItem = '';
  TaskForm: FormGroup = CreateTaskForm();
  TaskHierarchy: TaskHierarchyModel = new TaskHierarchyModel();
  constructor(
    private route: ActivatedRoute,
    private articlesService: ArticlesService,
    private commentsService: CommentsService,
    private router: Router,
    private userService: UserService,
    private taskManagementService: TaskManagementService,
    private messageBoxService: MessageBoxService,
    private  commentManagementService: CommentManagementService,
    private datepipe: DatePipe,
    private  taskHierarchyManagementService: TaskHierarchyManagementService,
    private  snackBarService: MatSnackBar
  ) {// Retreive the prefetched article
    this.route.data.subscribe(
      (data: { article: TaskModel }) => {
        this.task = data.article;
        this.TaskForm = GetTaskFormFromTaskModel(this.task);
        console.log(this.task);
        this.comments = [];
        // Load the comments on this article
        this.populateComments();
      }
    );   }

  ngOnInit() {
      // Load the current user's data
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;

        this.canModify = (this.currentUser.name === this.task.taskId);
      }
    );
    // Receiving estimated hours and spent hours separately and then plugging into taskform
    this.taskHierarchyManagementService.getTaskHierarchyByTaskId(this.task.taskId, 'children', this.onSuccess);
  }
  public onSuccess = (taskHierarchy: TaskHierarchyModel) => {
    this.snackBarService.open('Task Hierarchy Successfully received' , '', {duration: 300});
   this.TaskHierarchy = taskHierarchy;
    this.TaskForm.controls['hrsSpentTillNow'].setValue(taskHierarchy.totalHoursSpent);
  }
  seeInTaskTree() {
    // In hierarch view show three gen
    // l1 = parent of parent
    // l2 = parent
    // l3 = task selected
    this.taskManagementService.getTaskById(this.task.parentTaskId, 'children').subscribe({
      next: ( parentTask) => {
       this.navigateToTaskHierarchy(parentTask);
      },
      error: () => {
        this.messageBoxService.info('Error: Task not created.');
      }
    }); }
  navigateToTaskHierarchy(parentTask: TaskModel) {
    if ( parentTask.taskId === '0') {
      this.router.navigateByUrl('/task-tree?L1=' + this.task.taskId);
      return;
    }
    if (parentTask.parentTaskId === '0') {
      this.router.navigateByUrl('/task-tree?L1=' + parentTask.taskId + '&L2=' + this.task.taskId);
      return;
    }
    this.router.navigateByUrl('/task-tree?L1=' + parentTask.parentTaskId + '&L2=' + this.task.parentTaskId
      + '&L3=' + this.task.taskId);
  }
  goToParentTask() {
      this.router.navigateByUrl('/article/' + this.task.parentTaskId);
  }
  deleteArticle() {
    this.isDeleting = true;

    this.articlesService.destroy(this.task.taskId)
      .subscribe(
        success => {
          this.router.navigateByUrl('/');
        }
      );
  }

  populateComments() {
    this.commentManagementService.getCommentsByTaskId(this.task.taskId).subscribe({
      next: (commentList) => {
       this.comments.push.apply(this.comments, commentList);
      },
      error: () => { }
    });

  }

  addComment() {
    this.isSubmitting = true;
    this.commentFormErrors = {};

    const commentBody = this.commentControl.value;
    const newComment: TaskComment = {
      commentId: 'next',
      taskId: this.task.taskId,
      createdBy: 'shrikant',
      message: commentBody,
      createdAt: this.datepipe.transform(Date.now(), 'yyyy-MM-dd')};
    this.comments.unshift(newComment);
    this.commentControl.reset('');
    this.isSubmitting = false;
    this.commentManagementService.createOrUpdateComment(newComment).subscribe({
      next: (comment) => {
       console.log(comment);
      },
      error: () => { }
    });
  }

  onDeleteComment(comment) {
    this.commentsService.destroy(comment.id, this.task.taskId)
      .subscribe(
        success => {
          this.comments = this.comments.filter((item) => item !== comment);
        }
      );
  }




}
