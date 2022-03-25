import { Component, Input } from '@angular/core';

import { Article } from '../../core';
import {Task} from '../../tasks-hierarchy/models/task.model';
import {SearchTaskViewModel} from '../../home/interfaces/search-task-view.model';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html'
})
export class ArticlePreviewComponent {
  @Input() SearchTask: SearchTaskViewModel;
  onToggleFavorite(favorited: boolean) {

  }
}
