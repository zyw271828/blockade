import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { DocumentQueryComponent } from '../document-query/document-query.component';
import { DocumentService } from '../document.service';
import { DocumentQueryResultTableDataSource, DocumentQueryResultTableItem } from './document-query-result-table-datasource';

export interface DialogData {
  title: string;
  content: {
    item: string;
    value: string;
  }[];
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
  displayedColumns = [
    'id',
    'resourceID',
    'resourceType',
    'name',
    'operation'
  ];

  constructor(private documentQueryComponent: DocumentQueryComponent, private documentService: DocumentService, public dialog: MatDialog) {
    this.dataSource = new DocumentQueryResultTableDataSource(this.documentQueryComponent, this.documentService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  showDetail(resourceID: number) {
    // TODO: get details by resourceID
    let name = '';
    let resourceType = '';
    let hash = '';
    let ciphertextHash = '';
    let size = '';
    let ciphertextSize = '';
    let creator = '';
    let creationTime = new Date();
    let documentType = '';
    let precedingDocumentID = '';
    let headDocumentID = '';
    let entityAssetID = '';

    this.dialog.open(DocumentQueryResultDetailDialog, {
      data: {
        title: 'Detail',
        content: [
          { item: 'ResourceID', value: resourceID },
          { item: 'Name', value: name },
          { item: 'ResourceType', value: resourceType },
          { item: 'Hash', value: hash },
          { item: 'CiphertextHash', value: ciphertextHash },
          { item: 'Size', value: size },
          { item: 'CiphertextSize', value: ciphertextSize },
          { item: 'Creator', value: creator },
          { item: 'CreationTime', value: creationTime },
          { item: 'DocumentType', value: documentType },
          { item: 'PrecedingDocumentID', value: precedingDocumentID },
          { item: 'HeadDocumentID', value: headDocumentID },
          { item: 'EntityAssetID', value: entityAssetID }
        ]
      }
    });
  }
}

@Component({
  selector: 'document-query-result-detail-dialog',
  templateUrl: './document-query-result-detail-dialog.html',
  styleUrls: ['./document-query-result-detail-dialog.css']
})
export class DocumentQueryResultDetailDialog {
  displayedColumns: string[] = [
    'item',
    'value'
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  downloadDocument(resourceID: number) {
    // TODO: download document by resourceID
  }

  findInDataSource(dataSource: { item: string; value: string; }[], target: string): string {
    let result = dataSource.find(row => row.item === target)?.value;
    return (result === undefined) ? '' : result;
  }
}
