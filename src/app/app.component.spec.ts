import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AppComponent} from './app.component';
import { asyncScheduler, Observable} from 'rxjs';
import {observeOn} from 'rxjs/operators';
import {mockProfileModel} from './Models/Mocks/mockProfile.model';
import {UserService} from './core';
import {routes} from './app-routing.module';
import {RouterTestingModule} from '@angular/router/testing';
import {Location} from '@angular/common';
import {Router} from '@angular/router';


// Using Schedulers to create fake async function
const mockUserService = {
  populate() {
    const mockProfile = mockProfileModel;
    return new Observable((observer) => {
      observer.next(mockProfile);
    }).pipe(
      observeOn(asyncScheduler)
    );
  }
};

describe('AppComponent', () => {
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']); // created mock Router
  // and then spied on its naviagteByUrl ability

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [AppComponent],
      providers: [
        {provide: UserService, useValue: mockUserService},
        {provide: Router, useValue: routerSpy}]
    }).compileComponents();
  });
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
  it('navigate to "" redirects you to /profile', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.ngOnInit();
    tick();
    const navArgs = routerSpy.navigateByUrl.calls.first().args[0]; // First time 'navigationByUrl func called'
    expect(navArgs).toEqual('/profile'); // dummy used for testing;
  }));
});
