import { Component, Input } from '@angular/core';
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
  sprintList: string[] = ['23', '24'];
  public Profiles: ProfileStoreModel[] = [];
  constructor( private profileManagementService: ProfileManagementService) {
    this.GetProfiles();
  }

  private async GetProfiles() {
    this.Profiles = await this.profileManagementService.getAllProfiles().toPromise();
  }
  public GetProfileName(profileId: string): string {
    const profile = this.Profiles.filter(function (value) {
      return (value.profileId === profileId);
    });
    return profile[0] === undefined ? profileId : profile[0].name;
  }
}

