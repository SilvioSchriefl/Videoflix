import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVideoDetailComponent } from './user-video-detail.component';

describe('UserVideoDetailComponent', () => {
  let component: UserVideoDetailComponent;
  let fixture: ComponentFixture<UserVideoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserVideoDetailComponent]
    });
    fixture = TestBed.createComponent(UserVideoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
