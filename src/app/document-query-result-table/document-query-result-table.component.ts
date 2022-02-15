import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { DocumentQueryComponent } from '../document-query/document-query.component';
import { DocumentService } from '../document.service';
import { Utils } from '../utils';
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
    'resourceId',
    'resourceType',
    'name',
    'operation'
  ];

  mask: string = Utils.mask;

  constructor(private documentQueryComponent: DocumentQueryComponent, private documentService: DocumentService, public dialog: MatDialog) {
    this.dataSource = new DocumentQueryResultTableDataSource(this.documentQueryComponent, this.documentService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  showDetail(row: DocumentQueryResultTableItem) {
    if (row.resourceType != Utils.getRawDocumentType(Utils.getResourceTypes('document')[0])
      && (row.name === undefined
        || row.documentType === undefined
        || row.precedingDocumentId === undefined
        || row.headDocumentId === undefined
        || row.entityAssetId === undefined)) {
      this.documentService.getDocumentPropertiesById(row.resourceId).subscribe((documentProperties) => {
        if (row.name === undefined) {
          row.name = documentProperties.name;
        }
        if (row.documentType === undefined) {
          row.documentType = documentProperties.documentType;
        }
        if (row.precedingDocumentId === undefined) {
          row.precedingDocumentId = documentProperties.precedingDocumentId;
        }
        if (row.headDocumentId === undefined) {
          row.headDocumentId = documentProperties.headDocumentId;
        }
        if (row.entityAssetId === undefined) {
          row.entityAssetId = documentProperties.entityAssetId;
        }

        this.openDetailDialog(row);
      });
    } else { // row.name, row.documentType, row.precedingDocumentId, row.headDocumentId, row.entityAssetId are not undefined
      this.openDetailDialog(row);
    }
  }

  openDetailDialog(row: DocumentQueryResultTableItem) {
    this.dialog.open(DocumentQueryResultDetailDialog, {
      data: {
        title: 'Detail',
        content: [
          { item: 'ResourceId', value: row.resourceId },
          { item: 'Name', value: row.name === undefined ? this.mask : row.name },
          { item: 'ResourceType', value: row.resourceType },
          { item: 'Hash', value: row.hash },
          { item: 'CiphertextHash', value: row.ciphertextHash },
          { item: 'Size', value: row.size },
          { item: 'CiphertextSize', value: row.ciphertextSize },
          { item: 'Creator', value: row.creator },
          { item: 'CreationTime', value: row.creationTime },
          { item: 'DocumentType', value: row.documentType === undefined ? this.mask : row.documentType },
          { item: 'PrecedingDocumentId', value: row.precedingDocumentId === undefined ? this.mask : row.precedingDocumentId },
          { item: 'HeadDocumentId', value: row.headDocumentId === undefined ? this.mask : row.headDocumentId },
          { item: 'EntityAssetId', value: row.entityAssetId === undefined ? this.mask : row.entityAssetId }
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

  mask: string = Utils.mask;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private documentService: DocumentService, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  decryptDocument(dataSource: { item: string; value: string; }[]) {
    let authDialog = this.dialog.open(AuthDialogComponent, {
      width: '350px',
      data: {
        title: 'Authentication',
        resourceId: this.findInDataSource(dataSource, 'ResourceId')
      }
    });

    authDialog.afterClosed().subscribe(() => {
      let content: { item: string; value: string; }[] = [];

      this.documentService.getDocumentPropertiesById(
        this.findInDataSource(dataSource, 'ResourceId'),
        authDialog.componentInstance.keySwitchSessionId
      ).subscribe((documentProperties) => {
        dataSource.forEach(
          ({ item, value }) => {
            if (value === this.mask) {
              if (item === 'Name') {
                value = documentProperties.name === undefined ? this.mask : documentProperties.name;
              }
              if (item === 'DocumentType') {
                value = documentProperties.documentType === undefined ? this.mask : documentProperties.documentType;
              }
              if (item === 'PrecedingDocumentId') {
                value = documentProperties.precedingDocumentId === undefined ? this.mask : documentProperties.precedingDocumentId;
              }
              if (item === 'HeadDocumentId') {
                value = documentProperties.headDocumentId === undefined ? this.mask : documentProperties.headDocumentId;
              }
              if (item === 'EntityAssetId') {
                value = documentProperties.entityAssetId === undefined ? this.mask : documentProperties.entityAssetId;
              }
            }

            content.push({ item, value });
          }
        );

        this.dialog.open(DocumentQueryResultDetailDialog, {
          data: {
            title: 'Detail',
            content: content
          }
        });
      });
    });
  }

  downloadDocument(resourceId: string, resourceType: string, keySwitchSessionId?: string) {
    resourceType = Utils.getRawResourceType('document', resourceType);

    this.documentService.getDocumentById(resourceId, resourceType, keySwitchSessionId).subscribe(document => {
      if (document.contents !== undefined) {
        let file = new File([document.contents], document.name);
        let link = self.document.createElement('a');

        link.href = window.URL.createObjectURL(file);;
        link.click();
      } else { // document.contents is undefined
        let authDialog = this.dialog.open(AuthDialogComponent, {
          width: '350px',
          data: {
            title: 'Authentication',
            resourceId: resourceId
          }
        });

        authDialog.afterClosed().subscribe(() => {
          this.documentService.getDocumentById(resourceId, resourceType, authDialog.componentInstance.keySwitchSessionId).subscribe(document => {
            if (document.contents !== undefined) {
              let file = new File([document.contents], document.name);
              let link = self.document.createElement('a');

              link.href = window.URL.createObjectURL(file);;
              link.click();
            } else { // document.contents is undefined
              this._snackBar.open('Failed to download document', 'DISMISS', {
                duration: 5000
              });
            }
          });
        });
      }
    });
  }

  findInDataSource(dataSource: { item: string; value: string; }[], target: string): string {
    let result = dataSource.find(row => row.item === target)?.value;
    return (result === undefined) ? '' : result;
  }
}
