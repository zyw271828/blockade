import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentQueryComponent } from './document-query.component';

describe('DocumentQueryComponent', () => {
  let component: DocumentQueryComponent;
  let fixture: ComponentFixture<DocumentQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
