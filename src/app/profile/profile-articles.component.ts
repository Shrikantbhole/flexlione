import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ArticleListConfig, Profile } from '../core';
import {Observable} from 'rxjs';
import {SearchTaskViewModel} from '../shared/store/interfaces/search-task-view.model';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {map, startWith} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {empty} from 'rxjs/internal/Observer';
import {CalendarEvent} from 'angular-calendar';
import {ProfileComponent} from './profile.component';

@Component({
  selector: 'app-profile-articles',
  templateUrl: './profile-articles.component.html'
})
export class ProfileArticlesComponent implements OnInit {
  results: Observable<SearchTaskViewModel[]>;
  options: string[] = ['sprint1', 'sprint2'];
  sprintId: Observable<string>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private  snackBarService: MatSnackBar,
    private profileComponent: ProfileComponent
  ) {}

  profile: Profile;
  articlesConfig: ArticleListConfig = {
    type: 'all',
    filters: {}
  };

  ngOnInit() {
    this.results = this.store.select('searchTaskView');
    this.route.queryParams.subscribe({
        next: (param) => {
          if ( param.search !== undefined) {

            this.snackBarService.open('Success.Task assigned to sprint.' + param.search, '', { duration: 3000 });
            this.profileComponent.onTaskAddedToSprint();
            // Remove query params
            this.router.navigate([], {
              queryParams: {
                'search': null,
              },
              queryParamsHandling: 'merge'
            });
          }
        },
        error: () => {}
      });
  }

  private _filter(value: string) {
    console.log('Hi');
    console.log(value);
  }



}
