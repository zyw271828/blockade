import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { DocumentUploadRecordTableDataSource, DocumentUploadRecordTableItem } from './document-upload-record-table-datasource';

@Component({
  selector: 'app-document-upload-record-table',
  templateUrl: './document-upload-record-table.component.html',
  styleUrls: ['./document-upload-record-table.component.css']
})
export class DocumentUploadRecordTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DocumentUploadRecordTableItem>;
  dataSource: DocumentUploadRecordTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  constructor() {
    this.dataSource = new DocumentUploadRecordTableDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
