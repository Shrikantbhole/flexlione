import {Component, Input, OnInit} from '@angular/core';
import {SearchTaskViewStoreModel} from '../store/interfaces/search-task-view-store.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import {ProfileStoreModel} from '../store/interfaces/profile-store.model';
import {ProfileManagementService} from '../../Services/profile-management.service';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html'
})
export class ArticlePreviewComponent {
  @Input() SearchTask: SearchTaskViewStoreModel;
  @Input() Profiles: ProfileStoreModel[];
  sprintList: string[] = ['23', '24'];

  constructor( private profileManagementService: ProfileManagementService) {}
  public GetProfileName(profileId: string): string {
   let profile = [];
    if (this.Profiles !== undefined) {
     profile = this.Profiles.filter(function (value) {
       return (value.profileId === profileId);
     });
   }
   return profile[0] === undefined ? profileId : profile[0].name;
  }
}

