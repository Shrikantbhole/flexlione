
import {mockProfileModel} from '../../Models/Mocks/mockProfile.model';
import {asyncScheduler, Observable} from 'rxjs';
import {observeOn} from 'rxjs/operators';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {UserService} from '../../core';
import {HeaderComponent} from './header.component';
import {Store} from '@ngrx/store';
import {By} from '@angular/platform-browser';
import {Directive, HostListener, Input} from '@angular/core';
import {Router} from '@angular/router';

// Fake Router Link Directive is RouterLink Directive replacement
// Custom Directive will help if you need to use any mock service (eg here mockRouter) and make some operations on it

@Directive({
  selector: '[routerLink]' // Not Sure about the error.
})
class FakeRouterLink { // Not sure abt the error
  @Input()
  routerLink = '';

  constructor(
    private router: Router,
  ) { }

  @HostListener('click')
  onClick() {
    this.router.navigateByUrl(this.routerLink);
  }
}
// Using Schedulers to create fake async function
const mockUserService = {
  currentUser : new Observable((observer) => {
    observer.next(mockProfileModel);
  }).pipe(
    observeOn(asyncScheduler)
  )
};

// Creating Fake Store Class
class MockStore {
  public dispatch(obj) {
    console.log('dispatching from the mock store!');
  }
  public select(obj) {
    console.log('selecting from the mock store!');

    return new Observable((observer) => {
      observer.next('1');
    });
  }
}

// Creating Fake Router Service and making it spy on navigationByUrl
// Point to Note: Even if you use RouterLink Directive, it will be caught by above Spy
const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);


describe('HeaderComponent', () => {

  function clickHome() {
    const fixture = TestBed.createComponent(HeaderComponent);
    const homeLink = fixture.debugElement.nativeElement.querySelectorAll('a'); // a class refers to linked element in html
    homeLink.forEach(function (value)  {
      if (value.textContent === ' Sign in ') {
        // fixture.ngZone.run(() => value.triggerEventHandler('click', {button: 0}));
        value.click();
      }
    });
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, FakeRouterLink],
      providers: [
        {provide: UserService, useValue: mockUserService},
        {provide: Store, useClass: MockStore},
        {provide: Router, useValue: routerSpy}],
    }).compileComponents();
  });
  it('should create the app', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const headerComponent = fixture.componentInstance;
    expect(headerComponent).toBeTruthy();
  });
  it('should change username in header', fakeAsync(() => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const headerComponent = fixture.componentInstance;
    fixture.detectChanges();
   expect(headerComponent.currentUser).toEqual(undefined);
    headerComponent.ngOnInit();

    tick(); // Note: if you remove this then the test would run in synchronous mode and current user will remain undefined
    fixture.detectChanges();
    expect(headerComponent.currentUser.name).toEqual(mockProfileModel.name);
  }));
  it('navigates to home page when home link is clicked', fakeAsync(() => {
    const fixture = TestBed.createComponent(HeaderComponent);
    clickHome(); // Click on Home Link on Header Page
    tick();
    // fixture.detectChanges(); Don't need this since no data binding is happening, right?
    const navArgs = routerSpy.navigateByUrl.calls.first().args[0]; // First time 'navigationByUrl func called'
    tick(); // If removed this error - 1 periodic timer(s) still in the queue.
    expect(navArgs).toEqual('/login'); // dummy used for testing;
  }));

});
