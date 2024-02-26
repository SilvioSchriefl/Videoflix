import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUservideoDialogComponent } from './edit-uservideo-dialog.component';

describe('EditUservideoDialogComponent', () => {
  let component: EditUservideoDialogComponent;
  let fixture: ComponentFixture<EditUservideoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditUservideoDialogComponent]
    });
    fixture = TestBed.createComponent(EditUservideoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
