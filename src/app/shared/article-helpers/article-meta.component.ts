import { Component, Input } from '@angular/core';
import {Task} from '../../tasks-hierarchy/models/task.model';
import { Article } from '../../core';
import {SearchTaskViewModel} from '../../home/interfaces/search-task-view.model';

@Component({
  selector: 'app-article-meta',
  templateUrl: './article-meta.component.html'
})
export class ArticleMetaComponent {
  @Input() SearchTask: SearchTaskViewModel;
}
