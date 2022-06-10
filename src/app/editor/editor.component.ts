import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Article, ArticlesService, UserService} from '../core';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {ProfileStoreModel} from '../shared/store/interfaces/profile-store.model';
import {CreateTaskForm} from '../article/models/task-detail.form';



@Component({
  selector: 'app-editor-page',
  templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit {
  article: Article = {} as Article;
  articleForm: FormGroup;
  tagField = new FormControl();
  errors: Object = {};
  isSubmitting = false;
  EditTaskForm: FormGroup = CreateTaskForm();
  private Profiles: ProfileStoreModel[] = [];

  constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private store: Store<AppState>,
  ) {
    this.store.select('profile')
      .subscribe({ next: (profiles) => {
          this.Profiles = profiles;
        },
        error: () => {}
      });

    // Optional: subscribe to value changes on the form
    // this.articleForm.valueChanges.subscribe(value => this.updateArticle(value));
  }

  ngOnInit() {
    this.store.select('createTask').subscribe({
      next: (x) => {
        if (x === undefined) {
          return;
        }
        this.EditTaskForm.controls['parentTaskId'].setValue(x[0].parentTaskId);
        this.EditTaskForm.controls['taskId'].setValue('server generated');
        this.EditTaskForm.controls['taskId'].disable();
      }
    });


  }
  onAddFromTemplate(): void {
    this.router.navigateByUrl('/template');
  }

  private GetProfileName(profileId: string): string {
    const profile = this.Profiles.filter(function (value) {
      return (value.profileId === profileId);
    });
    return profile[0] === undefined ? profileId : profile[0].name;
  }
  private GetProfileId(profileName: string): string {
    const profile = this.Profiles.filter(function (value) {
      return (value.name === profileName);
    });
    return profile[0] === undefined ? profileName : profile[0].profileId;
  }

}
