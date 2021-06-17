import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthRecordComponent } from './auth-record.component';

describe('AuthRecordComponent', () => {
  let component: AuthRecordComponent;
  let fixture: ComponentFixture<AuthRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthRecordComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
