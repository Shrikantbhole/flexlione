import {Component, OnInit} from '@angular/core';
import {Task} from '../article/models/task.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticlesService, CommentsService, UserService} from '../core';
import {ChecklistManagementService} from '../article/service/checklist-management.service';

@Component({
  selector: 'app-task-master',
  templateUrl: './task-master.component.html',
})
export class TaskMasterComponent implements  OnInit {

public  taskList: Task[] = [];
public selectedTaskId: string;
  constructor(
    private route: ActivatedRoute,
  ) {     }

  ngOnInit() {


    /* Retreive the prefetched article*/
    this.route.data.subscribe(
      (data: { taskMaster: Task[] }) => {
        this.taskList = data.taskMaster;
        // this.task = data.article.find(x => x.taskId === this.route.snapshot.params['slug']);
        console.log(this.taskList);
      }
    );
  }

  onRowClick(taskId: string) {this.selectedTaskId = taskId; }

  onClick() { }
}
