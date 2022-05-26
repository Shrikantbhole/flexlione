import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import {TaskModel} from './models/task-detail.model';
import {AddOrEditScheduleDialogComponent} from '../profile/schedule/add-or-edit-schedule-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

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

import {TaskScheduleModel} from '../profile/models/task-schedule.model';

import {ApiError} from '../settings/api-error.model';
import {ProfileManagementService} from '../Services/profile-management.service';
import {ProfileStoreModel} from '../shared/store/interfaces/profile-store.model';


@Component({
  selector: 'app-article-page',
  templateUrl: './article.component.html',
  styleUrls: ['article.component.css']
})
export class ArticleComponent implements OnInit {
  @Output() newScheduleEvent  = new EventEmitter<TaskScheduleModel>();
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
  Profiles: ProfileStoreModel[];
  constructor(
    private dialog: MatDialog,
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
    private  snackBarService: MatSnackBar,
    private profileManagementService: ProfileManagementService
  ) {// Retreive the prefetched article
    this.route.data.subscribe(
      (data: { article: TaskModel }) => {
        this.task = data.article;
        this.TaskForm = GetTaskFormFromTaskModel(this.task);
        this.TaskForm.controls['taskId'].disable();
        console.log(this.task);
        this.comments = [];
        // Load the comments on this article
        this.populateComments();
      }
    );   }

  async ngOnInit() {
      // Load the current user's data
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );
    // Receiving estimated hours and spent hours separately and then plugging into taskform
    this.taskHierarchyManagementService.getTaskHierarchyByTaskId(this.task.taskId, 'children', this.onSuccess);
    // Get All Profiles
    await this.getAllProfiles();
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
     // this.isSubmitting = true;
    // this.commentFormErrors = {};

    const commentBody = this.commentControl.value;
    const newComment: TaskComment = {
      commentId: 'next',
      taskId: this.task.taskId,
      createdBy: this.currentUser.profileId,
      message: commentBody,
      createdAt: this.datepipe.transform(Date.now(), 'yyyy-MM-dd')};

    // this.comments.unshift(newComment);
     this.commentControl.reset('');
    // this.isSubmitting = false;
    this.comments = [];

    this.commentManagementService.createOrUpdateComment(newComment).subscribe({
      next: (comment) => {
       console.log(comment);
       this.snackBarService.open('Comment Successfully logged', '', {duration: 3000});
        this.populateComments();
       },
      error: (apiError: ApiError) => {this.messageBoxService.info('Error in logging comment', apiError.title, apiError.detail); }
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


  onAddToSchedule(task: TaskModel): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      task : task
    };
    this.dialog.open(AddOrEditScheduleDialogComponent, dialogConfig)
      .afterClosed().subscribe({
      next: (taskSchedule: TaskScheduleModel) => {
        this.newScheduleEvent.emit(taskSchedule);
      },
      error: () => {}
    });
  }

  async getAllProfiles() {
    this.Profiles = await this.profileManagementService.getAllProfiles().toPromise();
  }

  public  GetProfileId(profileName: string): string {
    const profile = this.Profiles.filter(function (value) {
      return (value.name === profileName);
    });
    return profile[0] === undefined ? profileName : profile[0].profileId;
  }




}
