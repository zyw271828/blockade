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
    'resourceID',
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
    if (row.name === undefined
      || row.documentType === undefined
      || row.precedingDocumentID === undefined
      || row.headDocumentID === undefined
      || row.entityAssetID === undefined) {
      this.documentService.getDocumentPropertiesById(row.resourceID).subscribe((documentProperties) => {
        if (row.name === undefined) {
          row.name = documentProperties.name;
        }
        if (row.documentType === undefined) {
          row.documentType = documentProperties.documentType;
        }
        if (row.precedingDocumentID === undefined) {
          row.precedingDocumentID = documentProperties.precedingDocumentID;
        }
        if (row.headDocumentID === undefined) {
          row.headDocumentID = documentProperties.headDocumentID;
        }
        if (row.entityAssetID === undefined) {
          row.entityAssetID = documentProperties.entityAssetID;
        }

        this.openDetailDialog(row);
      });
    } else { // row.name, row.documentType, row.precedingDocumentID, row.headDocumentID, row.entityAssetID are not undefined
      this.openDetailDialog(row);
    }
  }

  openDetailDialog(row: DocumentQueryResultTableItem) {
    this.dialog.open(DocumentQueryResultDetailDialog, {
      data: {
        title: '详细信息',
        content: [
          { item: '资源 ID', value: row.resourceID },
          { item: '名称', value: row.name === undefined ? this.mask : row.name },
          { item: '资源类型', value: row.resourceType },
          { item: '散列', value: row.hash },
          { item: '密文散列', value: row.ciphertextHash },
          { item: '大小', value: row.size },
          { item: '密文大小', value: row.ciphertextSize },
          { item: '创建者', value: row.creator },
          { item: '创建时间', value: row.creationTime },
          { item: '文档类型', value: row.documentType === undefined ? this.mask : row.documentType },
          { item: '前序文档 ID', value: row.precedingDocumentID === undefined ? this.mask : row.precedingDocumentID },
          { item: '头文档 ID', value: row.headDocumentID === undefined ? this.mask : row.headDocumentID },
          { item: '实体资产 ID', value: row.entityAssetID === undefined ? this.mask : row.entityAssetID }
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
        title: '身份验证',
        resourceID: this.findInDataSource(dataSource, '资源 ID')
      }
    });

    authDialog.afterClosed().subscribe(() => {
      let content: { item: string; value: string; }[] = [];

      this.documentService.getDocumentPropertiesById(
        this.findInDataSource(dataSource, '资源 ID'),
        authDialog.componentInstance.keySwitchSessionID
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
                value = documentProperties.precedingDocumentID === undefined ? this.mask : documentProperties.precedingDocumentID;
              }
              if (item === '头文档 ID') {
                value = documentProperties.headDocumentID === undefined ? this.mask : documentProperties.headDocumentID;
              }
              if (item === '实体资产 ID') {
                value = documentProperties.entityAssetID === undefined ? this.mask : documentProperties.entityAssetID;
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

  downloadDocument(resourceID: string, resourceType: string, keySwitchSessionID?: string) {
    resourceType = Utils.getRawResourceType('document', resourceType);

    this.documentService.getDocumentById(resourceID, resourceType, keySwitchSessionID).subscribe(document => {
      if (document.contents !== undefined) {
        let file = new File([document.contents], document.name);
        let link = self.document.createElement('a');

        link.href = window.URL.createObjectURL(file);;
        link.click();
      } else { // document.contents is undefined
        let authDialog = this.dialog.open(AuthDialogComponent, {
          width: '350px',
          data: {
            title: '身份验证',
            resourceID: resourceID
          }
        });

        authDialog.afterClosed().subscribe(() => {
          this.documentService.getDocumentById(resourceID, resourceType, authDialog.componentInstance.keySwitchSessionID).subscribe(document => {
            if (document.contents !== undefined) {
              let file = new File([document.contents], document.name);
              let link = self.document.createElement('a');

              link.href = window.URL.createObjectURL(file);;
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
