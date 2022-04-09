import { Component, Input } from '@angular/core';
import {SearchTaskViewModel} from '../store/interfaces/search-task-view.model';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html'
})
export class ArticlePreviewComponent {
  @Input() SearchTask: SearchTaskViewModel;
  sprintList: string[] = ['23', '24'];
}
