import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { User, UserService } from '../core';
import {ProfileModel} from '../profile/models/profile.model';
import {ApiError} from './api-error.model';
import {MessageBoxService} from './message-box.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  user: ProfileModel = {} as ProfileModel;
  settingsForm: FormGroup;
  errors: Object = {};
  isSubmitting = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private  messageBoxService: MessageBoxService
  ) {
    // create form group using the form builder
    this.settingsForm = this.fb.group({
      image: '',
      name: '',
      bio: '',
      emailId: '',
      password: ''
    });
    this.settingsForm.controls['emailId'].disable();
    // Optional: subscribe to changes on the form
    // this.settingsForm.valueChanges.subscribe(values => this.updateUser(values));
  }

  ngOnInit() {
    // Make a fresh copy of the current user's object to place in editable form fields
    Object.assign(this.user, this.userService.getCurrentUser());
    // Fill the form
    this.settingsForm.patchValue(this.user);
  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/');
  }

  submitForm() {
    this.isSubmitting = true;

    // update the model
    this.updateUser(this.settingsForm.value);

    this.userService
      .update(this.user)
      .subscribe({
        next : (updatedProfile) => {
          this.router.navigateByUrl('/profile/' + updatedProfile.profileId);
        },
        error : (apiError: ApiError) => {
          this.messageBoxService.info('Error in updating profile', apiError.title, apiError.detail);
          this.errors = apiError;
          this.isSubmitting = false;
        }
      });
  }

  updateUser(values: Object) {
    Object.assign(this.user, values);
  }

}
