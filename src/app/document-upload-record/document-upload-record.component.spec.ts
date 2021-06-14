import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentUploadRecordComponent } from './document-upload-record.component';

describe('DocumentUploadRecordComponent', () => {
  let component: DocumentUploadRecordComponent;
  let fixture: ComponentFixture<DocumentUploadRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentUploadRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentUploadRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
