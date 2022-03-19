import { Component, Input } from '@angular/core';
import {Task} from '../../tasks-hierarchy/models/task.model';
import { Article } from '../../core';

@Component({
  selector: 'app-article-meta',
  templateUrl: './article-meta.component.html'
})
export class ArticleMetaComponent {
  @Input() Task: Task;
}
