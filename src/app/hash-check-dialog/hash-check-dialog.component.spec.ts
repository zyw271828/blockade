import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashCheckDialogComponent } from './hash-check-dialog.component';

describe('HashCheckDialogComponent', () => {
  let component: HashCheckDialogComponent;
  let fixture: ComponentFixture<HashCheckDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HashCheckDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HashCheckDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
