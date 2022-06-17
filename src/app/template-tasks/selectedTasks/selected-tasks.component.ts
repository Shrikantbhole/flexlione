import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {TaskModel} from '../../article/models/task-detail.model';
import {Template} from '../../article/models/template.model';




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
  public generatedTaskForUpdate: TaskModel [] = [];
  constructor() {}

  @Input() bundleSelectedTask: TaskModel [];
    public taskForGeneration: TaskModel;
    public isEdit = false;
    public action = 'generate';
  @Output() refreshClicked: EventEmitter<string> = new EventEmitter<string>();

  onClickGenerate(task: TaskModel) {
this.taskForGeneration = task;
       this.taskForGeneration.taskId = 'server generated'; }

  ngOnInit(): void {
    this.selectedTasks = this.bundleSelectedTask;
  }

  onClickRefresh() {
    this.refreshClicked.emit();
    this.selectedTasks.splice(0, this.selectedTasks.length);
   }

  onTaskGeneration(task: TaskModel) {
    this.generatedTaskForUpdate.push(task);
    console.log(this.generatedTaskForUpdate);
  }

  onClickUpdate(task: TaskModel) {
    this.taskForGeneration = task;
  }
}


