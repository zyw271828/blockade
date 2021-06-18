import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetQueryComponent } from './asset-query.component';


describe('AssetQueryComponent', () => {
  let component: AssetQueryComponent;
  let fixture: ComponentFixture<AssetQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetQueryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
