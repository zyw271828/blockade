import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthRequestComponent } from './auth-request.component';

describe('AuthRequestComponent', () => {
  let component: AuthRequestComponent;
  let fixture: ComponentFixture<AuthRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthRequestComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
