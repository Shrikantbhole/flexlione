import {Component, Input, OnInit} from '@angular/core';
import {TaskModel} from '../article/models/taskModel';
import {Template} from '../article/models/template.model';



@Component({
  selector: 'app-selected-tasks',
  templateUrl: './selected-tasks.component.html',

})

export class SelectedTasksDisplayComponent implements OnInit {

  public templateTasks: TaskModel[] = [];
  public selectedTaskId: string;
  public selectedTemplate: Template;
  public selectedTemplateId: string;
  public selectedTasks: TaskModel [] = [];
  constructor() {}

  @Input() bundleSelectedTask: TaskModel [];
    public taskForGeneration: TaskModel;
    public isEdit = false;
    public action = 'generate';

  onClickGenerate(task: TaskModel) {
this.taskForGeneration = task;
        }

  ngOnInit(): void {
    this.selectedTasks = this.bundleSelectedTask;
  }
  changeButtonStatus() {
    this.isEdit = true;
}

  onClickRefresh() {
    this.selectedTasks.splice(0, this.selectedTasks.length);
   }
}


