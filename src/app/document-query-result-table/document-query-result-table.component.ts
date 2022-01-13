import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
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

  showDetail(row: DocumentQueryResultTableItem) {
    let authDialog = this.dialog.open(AuthDialogComponent, {
      data: {
        title: 'Authentication'
      }
    });

    authDialog.afterClosed().subscribe(() => {
      if (authDialog.componentInstance.isAuthenticated) {
        this.dialog.open(DocumentQueryResultDetailDialog, {
          data: {
            title: 'Detail',
            content: [
              { item: 'ResourceID', value: row.resourceID },
              { item: 'Name', value: row.name },
              { item: 'ResourceType', value: row.resourceType },
              { item: 'Hash', value: row.hash },
              { item: 'CiphertextHash', value: row.ciphertextHash },
              { item: 'Size', value: row.size },
              { item: 'CiphertextSize', value: row.ciphertextSize },
              { item: 'Creator', value: row.creator },
              { item: 'CreationTime', value: row.creationTime },
              { item: 'DocumentType', value: row.documentType },
              { item: 'PrecedingDocumentID', value: row.precedingDocumentID },
              { item: 'HeadDocumentID', value: row.headDocumentID },
              { item: 'EntityAssetID', value: row.entityAssetID }
            ]
          }
        });
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private documentService: DocumentService) { }

  downloadDocument(resourceID: string, resourceType: string, keySwitchSessionID?: string) {
    this.documentService.getDocumentById(resourceID, resourceType, keySwitchSessionID).subscribe(document => {
      let file = new File([document.content], document.name);
      let link = self.document.createElement('a');

      link.href = window.URL.createObjectURL(file);;
      link.click();
    });
  }

  findInDataSource(dataSource: { item: string; value: string; }[], target: string): string {
    let result = dataSource.find(row => row.item === target)?.value;
    return (result === undefined) ? '' : result;
  }
}
