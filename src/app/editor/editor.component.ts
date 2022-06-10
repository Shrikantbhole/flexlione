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
  ) {}

  ngOnInit() {
    // Creating a Form EditTaskForm of Class Formgroup and passing it down to Task-Form Component
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
    this.router.navigateByUrl('/master');
  }
}
