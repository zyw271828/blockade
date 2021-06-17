import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthApproveComponent } from './auth-approve.component';


describe('AuthApproveComponent', () => {
  let component: AuthApproveComponent;
  let fixture: ComponentFixture<AuthApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthApproveComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
