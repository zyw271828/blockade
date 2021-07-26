import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { DocumentUploadRecordTableDataSource, DocumentUploadRecordTableItem } from './document-upload-record-table-datasource';

import { Document } from '../document';
import { DocumentService } from '../document.service';

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
  data: Document[] = [];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'resourceID',
    'resourceType',
    'name',
    'creationTime'
  ];

  constructor(private documentService: DocumentService) {
    this.dataSource = new DocumentUploadRecordTableDataSource();
  }

  ngOnInit(): void {
    this.getRecord();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  private getRecord(): void {
    this.data = [];
    this.documentService.getUploadRecord().subscribe(res => {
      for (let i of res.IDs) {
        this.documentService.getDocument(i).subscribe(resp => {
          this.data.push(resp);
        })
      }
    });
  }
}
