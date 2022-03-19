import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticlesService, CommentsService, UserService} from '../core';
import {ChecklistManagementService} from '../tasks-hierarchy/checklist-management.service';
import {Task} from '../tasks-hierarchy/models/task.model';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['article.component.css']
})
export class TaskFormComponent implements OnInit {
   UserList: string[] = ['Chirag', 'Venkatesh', 'Birendra', 'Akash',
    'Tejesh', 'Anuj', 'Sundeep', 'Raja', 'Shrikant', 'Nimmit'];
  task: Task;
  deadline: FormControl = new FormControl(new Date());

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {


    // Retreive the prefetched article
    this.route.data.subscribe(
      (data: { article: Task[] }) => {
        this.task = data.article.find(x => x.taskId === this.route.snapshot.params['slug']);
        console.log(this.task);
      }
    );
  }
}
