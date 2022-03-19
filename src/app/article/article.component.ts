import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import {Task} from '../tasks-hierarchy/models/task.model';


import {
  ArticlesService,
  Comment,
  CommentsService,
  User,
  UserService
} from '../core';
import {CheckListItem} from '../tasks-hierarchy/models/check-list-item.model';
import {ChecklistManagementService} from '../tasks-hierarchy/checklist-management.service';

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
  comments: Comment[] = [];
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
    private checkListManagementService: ChecklistManagementService
  ) {     }

  ngOnInit() {


    // Retreive the prefetched article
    this.route.data.subscribe(
      (data: { article: Task[] }) => {
        this.task = data.article.find(x => x.taskId === this.route.snapshot.params['slug']);
        console.log(this.task);
        this.comments = [];
        // Load the comments on this article
        this.populateComments();
      }
    );
    // Load the current user's data
    this.userService.currentUser.subscribe(
      (userData: User) => {
        this.currentUser = userData;

        this.canModify = (this.currentUser.username === this.task.taskId);
      }
    );
  }

  onToggleFavorite(favorited: boolean) {

  }

  seeInTaskTree() {
    this.router.navigateByUrl('/task-tree?L1=' + this.task.taskId);
  }
  goToParentTask() {
    this.router.navigateByUrl('/article' + this.task.parentTaskId);
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
  }

  addComment() {
    this.isSubmitting = true;
    this.commentFormErrors = {};

    const commentBody = this.commentControl.value;
    const newComment: Comment = {id: 2,
      author: 'shrikant',
      body: commentBody,
      createdAt: ''};
    console.log(this.comments);
    this.comments.unshift(newComment);
    this.commentControl.reset('');
    this.isSubmitting = false;
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
