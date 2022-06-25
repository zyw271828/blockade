import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { DetailHelper } from '../detail-helper';
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

  infinity: number = Number.MAX_SAFE_INTEGER;

  currentPageSize: number = 10;

  constructor(private documentQueryComponent: DocumentQueryComponent, private documentService: DocumentService, public dialog: MatDialog) {
    this.dataSource = new DocumentQueryResultTableDataSource(this.documentQueryComponent, this.documentService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  onPaginationChange(event: PageEvent) {
    if (event.pageSize !== this.currentPageSize) {
      this.paginator.pageIndex = 0;
      this.dataSource.bookmarks = [''];
      this.currentPageSize = event.pageSize;
    }
  }

  showDetail(row: DocumentQueryResultTableItem) {
    let detailHelper = new DetailHelper(this.dialog, this.documentService, undefined);

    detailHelper.showDocumentDetail(row, DocumentQueryResultDetailDialog);
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

  resourceTypes: string[] = Utils.getResourceTypes('document');

  mask: string = Utils.mask;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private documentService: DocumentService, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  decryptDocument(dataSource: { item: string; value: string; }[]) {
    let authDialog = this.dialog.open(AuthDialogComponent, {
      width: '350px',
      data: {
        title: '身份验证',
        resourceId: this.findInDataSource(dataSource, '资源 ID')
      }
    });

    authDialog.afterClosed().subscribe(() => {
      let content: { item: string; value: string; }[] = [];

      this.documentService.getDocumentPropertiesById(
        this.findInDataSource(dataSource, '资源 ID'),
        authDialog.componentInstance.keySwitchSessionId
      ).subscribe((documentProperties) => {
        dataSource.forEach(
          ({ item, value }) => {
            if (value === this.mask) {
              if (item === '名称') {
                value = documentProperties.name === undefined ? this.mask : documentProperties.name;
              }
              if (item === '文档类型') {
                value = documentProperties.documentType === undefined ? this.mask : documentProperties.documentType;
              }
              if (item === '前序文档 ID') {
                value = documentProperties.precedingDocumentId === undefined ? this.mask : documentProperties.precedingDocumentId;
              }
              if (item === '头文档 ID') {
                value = documentProperties.headDocumentId === undefined ? this.mask : documentProperties.headDocumentId;
              }
              if (item === '实体资产 ID') {
                value = documentProperties.entityAssetId === undefined ? this.mask : documentProperties.entityAssetId;
              }
            }

            content.push({ item, value });
          }
        );

        this.dialog.open(DocumentQueryResultDetailDialog, {
          data: {
            title: '详细信息',
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
        let file = new File([window.atob(String(document.contents))], document.name);
        let link = self.document.createElement('a');

        link.href = window.URL.createObjectURL(file);
        link.download = document.name;
        link.click();
      } else { // document.contents is undefined
        let authDialog = this.dialog.open(AuthDialogComponent, {
          width: '350px',
          data: {
            title: '身份验证',
            resourceId: resourceId
          }
        });

        authDialog.afterClosed().subscribe(() => {
          this.documentService.getDocumentById(resourceId, resourceType, authDialog.componentInstance.keySwitchSessionId).subscribe(document => {
            if (document.contents !== undefined) {
              let file = new File([window.atob(String(document.contents))], document.name);
              let link = self.document.createElement('a');

              link.href = window.URL.createObjectURL(file);
              link.download = document.name;
              link.click();
            } else { // document.contents is undefined
              this._snackBar.open('下载文档失败', '关闭', {
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
