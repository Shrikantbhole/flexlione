import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import {ProfileComponent} from '../../profile/profile.component';
import {AutoSearchComponent} from './auto-search.component';
import {TestBed} from '@angular/core/testing';
import {HeaderComponent} from '../layout';
import {UserService} from '../../core';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ProfileManagementService} from '../../Services/profile-management.service';
import {SearchFormComponent} from '../../home/Search/search-form.component';
import {TaskScheduleManagementService} from '../../Services/task-schedule-management.service';
import {MessageBoxService} from '../../settings/message-box.service';
import {asyncScheduler, Observable} from 'rxjs';
import {mockParams, mockProfile, mockProfiles, mockSearchTaskViewStoresForRoute, mockTaskSchedules} from '../../Models/Mocks/mockProfile';
import {observeOn} from 'rxjs/operators';
import {ReactiveFormsModule} from '@angular/forms';



const mockSearchFormComponent = [];

const mockActivatedRoute = Object.assign({});
mockActivatedRoute.data =  new Observable((observer) => {
  observer.next(mockSearchTaskViewStoresForRoute);
}).pipe(
  observeOn(asyncScheduler)
);
mockActivatedRoute.queryParams =  new Observable((observer) => {
  observer.next(mockParams);
}).pipe(
  observeOn(asyncScheduler)
);



class MockProfileManagementService {
  public getAllProfiles() {
    console.log('getting mock profiles!');
    return new Observable((observer) => {
      observer.next(mockProfiles);
    }).pipe(
      observeOn(asyncScheduler)
    );
  }

  public getProfileById() {
    console.log('getting mock profiles!');
    return new Observable((observer) => {
      observer.next(mockProfile);
    }).pipe(
      observeOn(asyncScheduler)
    );
  }
}

// Creating Fake Store Class
class MockStore {
  public dispatch(obj) {
    console.log('dispatching from the mock store!');
  }

  public select(obj) {
    console.log('selecting from the mock store!');

    return new Observable((observer) => {
      observer.next('1');
    }).pipe(
      observeOn(asyncScheduler)
    );
  }
}


class MockUserService  {
  currentUser = new Observable((observer) => {
    observer.next(mockProfile);
  }).pipe(
    observeOn(asyncScheduler)
  );
}


class MockTaskScheduleManagementService  {
   public getTaskScheduleByProfileId(profileId: string, month: number, year: number) {
     return new Observable((observer) => {
       observer.next(mockTaskSchedules);
     }).pipe(
       observeOn(asyncScheduler)
     );
   }
}


describe('mockDirectiveAttribute', () => {
  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent]
    }).compileComponents();
    return MockBuilder(ProfileComponent)
      .mock(AutoSearchComponent)
      .mock(Store, MockStore)
      .mock(ActivatedRoute, mockActivatedRoute)
      .mock(MatDialog)
      .mock(Router)
      .mock(MessageBoxService)
      .keep(ReactiveFormsModule)
      .provide({provide: ProfileManagementService, useClass: MockProfileManagementService})
      .provide({provide: UserService, useClass: MockUserService})
      .provide({provide: TaskScheduleManagementService, useClass: MockTaskScheduleManagementService}) // Remember to use UseClass
      .provide({provide: SearchFormComponent, useValue: mockSearchFormComponent})
      .provide({provide: UserService, useValue: MockUserService});
  });

  it('sends correct value to the input', () => {
    const fixture = MockRender(ProfileComponent);
    const component = fixture.point.componentInstance;
    const mockDirective = ngMocks.get(
      ngMocks.find('app-auto-search'),
      AutoSearchComponent
    );
    component.options = ['blaaa'];
    fixture.detectChanges();
    expect(mockDirective.options).toEqual(['blaaa']);
  });
});
