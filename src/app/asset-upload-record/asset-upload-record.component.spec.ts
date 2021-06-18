import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetUploadRecordComponent } from './asset-upload-record.component';


describe('AssetUploadRecordComponent', () => {
  let component: AssetUploadRecordComponent;
  let fixture: ComponentFixture<AssetUploadRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetUploadRecordComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetUploadRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
