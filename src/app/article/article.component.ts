import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import {Task} from './models/task.model';


import {
  ArticlesService,
  CommentsService,
  User,
  UserService
} from '../core';
import {CheckListItem} from './models/check-list-item.model';
import {ChecklistManagementService} from './service/checklist-management.service';
import {TaskManagementService} from './service/task-management-service';
import {MessageBoxService} from '../settings/message-box.service';
import {CommentManagementService} from './service/comment-management.service';
import {TaskComment} from './models/task-comment.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-article-page',
  templateUrl: './article.component.html',
  styleUrls: ['article.component.css']
})
export class ArticleComponent implements OnInit {
  UserList: string[] = ['Chirag', 'Venkatesh', 'Birendra', 'Akash',
    'Tejesh', 'Anuj', 'Sundeep', 'Raja', 'Shrikant', 'Nimmit'];
  task: Task;
  currentUser: User;
  canModify: boolean;
  comments: TaskComment[] = [];
  commentControl = new FormControl();
  commentFormErrors = {};
  isSubmitting = false;
  isDeleting = false;
  selectedCheckListItem = '';
  // FormControl to track value of Deadline
  deadline: FormControl = new FormControl(new Date());
  constructor(
    private route: ActivatedRoute,
    private articlesService: ArticlesService,
    private commentsService: CommentsService,
    private router: Router,
    private userService: UserService,
    private taskManagementService: TaskManagementService,
    private messageBoxService: MessageBoxService,
    private  commentManagementService: CommentManagementService,
    private datepipe: DatePipe
  ) {// Retreive the prefetched article
    this.route.data.subscribe(
      (data: { article: Task }) => {
        this.task = data.article;
        console.log(this.task);
        this.comments = [];
        // Load the comments on this article
        this.populateComments();
      }
    );   }

  ngOnInit() {
      // Load the current user's data
    this.userService.currentUser.subscribe(
      (userData: User) => {
        this.currentUser = userData;

        this.canModify = (this.currentUser.username === this.task.taskId);
      }
    );
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
  navigateToTaskHierarchy(parentTask: Task) {
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

   /*
    this.comments.push({
     id: 1,
     author: 'shrikant',
     body: 'What is the update?',
     createdAt: ''
   });
    this.comments.push({
      id: 2,
      author: 'shrikant',
      body: 'Has this task completed?',
      createdAt: ''
    });

    */
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
