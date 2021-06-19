import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AssetQueryResultTableComponent } from './asset-query-result-table.component';


describe('AssetQueryResultTableComponent', () => {
  let component: AssetQueryResultTableComponent;
  let fixture: ComponentFixture<AssetQueryResultTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AssetQueryResultTableComponent],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetQueryResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
