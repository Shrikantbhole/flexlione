import {MockBuilder, MockInstance, MockRender, ngMocks} from 'ng-mocks';
import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {asyncScheduler, EMPTY, EmptyError, Observable} from 'rxjs';
import {observeOn} from 'rxjs/operators';
import {ReactiveFormsModule} from '@angular/forms';
import {EventEmitter} from '@angular/core';
import {HeaderComponent} from '../shared';
import {ProfileComponent} from './profile.component';
import {AutoSearchComponent} from '../shared/search/auto-search.component';
import {ProfileManagementService} from '../Services/profile-management.service';
import {MessageBoxService} from '../settings/message-box.service';
import {UserService} from '../core';
import {TaskScheduleManagementService} from '../Services/task-schedule-management.service';
import {SearchFormComponent} from '../home/Search/search-form.component';
import {mockParams, mockProfile, mockProfiles, mockSearchTaskViewStoresForRoute, mockTaskSchedules} from '../Models/Mocks/mockProfile';
import {ProfileTaskDumpComponent} from './profile-task-dump/profile-task-dump.component';
import {SprintModel} from './models/sprint.model';
import {SprintPreviewComponent} from './sprint/sprint-preview.component';
import {TaskScheduleHandlerComponent} from './schedule/task-schedule-handler.component';



const mockSearchFormComponent = [];

const mockActivatedRoute = Object.assign({});
// asyncScheduler is used to convert Synchronous object into async
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
      .mock(Store)
      .mock(ActivatedRoute, mockActivatedRoute)
      .mock(MatDialog)
      .mock(Router)
      .mock(MessageBoxService)
      .mock(UserService)
      .mock(ProfileManagementService)
      .keep(ReactiveFormsModule)
      .provide({provide: TaskScheduleManagementService, useClass: MockTaskScheduleManagementService}) // Remember to use UseClass
      .provide({provide: SearchFormComponent, useValue: mockSearchFormComponent});
  });

  beforeEach(() => {
    // Application of mock Instance - Set Desired value to any declaration of our concerned component
    MockInstance(UserService, () => ({
       currentUser: EMPTY
    }));
    // here in Mock Instance you replace return value of the function with value you wish to return
    MockInstance(ProfileManagementService, 'getProfileById', () => EMPTY);
    MockInstance(ProfileManagementService, 'getAllProfiles', () => EMPTY);
    MockInstance(Store, 'select', () => EMPTY);
    MockInstance(Store, 'dispatch', () => 'fake');
  });
  it('sends correct value to the input', () => {
    const fixture = MockRender(ProfileComponent);
    const component = fixture.point.componentInstance;
    const mockAutoSearchComponent = ngMocks.get(
      ngMocks.find('app-auto-search'),
      AutoSearchComponent
    );
    component.options = ['blaaa'];
    fixture.detectChanges();
    expect(mockAutoSearchComponent.options).toEqual(['blaaa']);
  });

  it('does something on emit of child directive', () => {
    const fixture = MockRender(ProfileComponent);
    const component = fixture.point.componentInstance;
    const mockAutoSearchComponent = ngMocks.get(
      ngMocks.find('app-auto-search'),
      AutoSearchComponent
    );
    // ProfileComponent Listens to newItemEvent Emitter via updateProfile()
    // Let's install a spy and trigger the output
    ngMocks.stubMember(component, 'updateProfile', jasmine.createSpy());
    // Emitting some value from mock AutoSearch Component
    mockAutoSearchComponent.newItemEvent.emit('5');
    expect(component.updateProfile).toHaveBeenCalledWith('5');
  });

  it('send correct value to profile task dump', () => {
    const fixture = MockRender(ProfileComponent);
    const component = fixture.point.componentInstance;
    // Created a mock for profileTaskDumpComponent
    const mockProfileTaskDumpComponent = ngMocks.get(
      ngMocks.find('app-task-schedule-handler'),
      TaskScheduleHandlerComponent);
    component.sprintList = [{ sprintId : '1', deliverable: '', owner : '', description: '', delivered: '', score: 0, tasks: null, toDate: null, fromDate: null }];
    component.getSprintIds();
    fixture.detectChanges();
  });
});
