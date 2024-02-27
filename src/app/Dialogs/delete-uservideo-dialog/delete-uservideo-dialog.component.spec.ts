import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUservideoDialogComponent } from './delete-uservideo-dialog.component';

describe('DeleteUservideoDialogComponent', () => {
  let component: DeleteUservideoDialogComponent;
  let fixture: ComponentFixture<DeleteUservideoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteUservideoDialogComponent]
    });
    fixture = TestBed.createComponent(DeleteUservideoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
