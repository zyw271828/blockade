import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { DocumentQueryResultTableDataSource, DocumentQueryResultTableItem } from './document-query-result-table-datasource';

export interface DialogData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-document-query-result-table',
  templateUrl: './document-query-result-table.component.html',
  styleUrls: ['./document-query-result-table.component.css']
})
export class DocumentQueryResultTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DocumentQueryResultTableItem>;
  dataSource: DocumentQueryResultTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id',
    'resourceID',
    'resourceType',
    'name',
    'operation'
  ];

  constructor(public dialog: MatDialog) {
    this.dataSource = new DocumentQueryResultTableDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  showDetail(resourceID: number) {
    // TODO: get details by resourceID 
    this.dialog.open(DocumentQueryResultDetailDialog, {
      data: {
        title: 'Detail',
        content: 'resourceID: ' + resourceID
      }
    });
  }
}

@Component({
  selector: 'document-query-result-detail-dialog',
  templateUrl: 'document-query-result-detail-dialog.html',
})
export class DocumentQueryResultDetailDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
