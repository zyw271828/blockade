import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetUploadComponent } from './asset-upload.component';


describe('AssetUploadComponent', () => {
  let component: AssetUploadComponent;
  let fixture: ComponentFixture<AssetUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetUploadComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
