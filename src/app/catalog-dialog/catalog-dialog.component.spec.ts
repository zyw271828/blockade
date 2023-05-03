import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogDialogComponent } from './catalog-dialog.component';

describe('CatalogDialogComponent', () => {
  let component: CatalogDialogComponent;
  let fixture: ComponentFixture<CatalogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CatalogDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
