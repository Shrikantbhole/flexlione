import { Component, Input } from '@angular/core';

import { Article } from '../../core';
import {Task} from '../../tasks-hierarchy/models/task.model';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html'
})
export class ArticlePreviewComponent {
  @Input() task: Task;

  onToggleFavorite(favorited: boolean) {

  }
}
