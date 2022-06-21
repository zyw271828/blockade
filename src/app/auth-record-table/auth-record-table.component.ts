import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AssetService } from '../asset.service';
import { AuthService } from '../auth.service';
import { DocumentService } from '../document.service';
import { ResourceService } from '../resource.service';
import { Utils } from '../utils';
import { AuthRecordTableDataSource, AuthRecordTableItem } from './auth-record-table-datasource';

export interface DialogData {
  title: string;
  content: {
    item: string;
    value: string;
  }[];
}

@Component({
  selector: 'app-auth-record-table',
  templateUrl: './auth-record-table.component.html',
  styleUrls: ['./auth-record-table.component.css']
})
export class AuthRecordTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<AuthRecordTableItem>;
  dataSource: AuthRecordTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'resourceId',
    'resourceType',
    'name',
    'authSessionId',
    'status',
    'operation'
  ];

  authSessionStatuses: string[] = Utils.getAuthSessionStatuses();

  infinity: number = Number.MAX_SAFE_INTEGER;

  currentPageSize: number = 10;

  constructor(private authService: AuthService, private resourceService: ResourceService, public dialog: MatDialog) {
    this.dataSource = new AuthRecordTableDataSource(this.authService, this.resourceService);
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

  showDetail(row: AuthRecordTableItem) {
    let content = [
      { item: '数据类型', value: row.dataType },
      { item: '资源 ID', value: row.resourceId },
      { item: '名称', value: row.name },
      { item: '资源类型', value: row.resourceType },
      { item: '散列', value: row.hash },
      { item: '密文散列', value: row.ciphertextHash },
      { item: '大小', value: row.size },
      { item: '密文大小', value: row.ciphertextSize },
      { item: '创建者', value: row.creator },
      { item: '创建时间', value: row.creationTime }
    ];

    if (row.dataType === Utils.getDataTypes()[0]) { // dataType is Document
      content.push(
        { item: '文档类型', value: row.documentType },
        { item: '前序文档 ID', value: row.precedingDocumentId },
        { item: '头文档 ID', value: row.headDocumentId },
        { item: '实体资产 ID', value: row.entityAssetId }
      );
    } else { // dataType is EntityAsset
      content.push({ item: '设计文档 ID', value: row.designDocumentId });
    }

    this.dialog.open(AuthRecordDetailDialog, {
      data: {
        title: '详细信息',
        content: content
      }
    });
  }
}

@Component({
  selector: 'auth-record-detail-dialog',
  templateUrl: './auth-record-detail-dialog.html',
  styleUrls: ['./auth-record-detail-dialog.css']
})
export class AuthRecordDetailDialog {
  displayedColumns: string[] = [
    'item',
    'value'
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private documentService: DocumentService, private assetService: AssetService) { }

  downloadResource(resourceId: string, dataType: string, resourceType: string) {
    if (dataType === Utils.getDataTypes()[0]) { // dataType is Document
      resourceType = Utils.getRawResourceType('document', resourceType);

      this.documentService.getDocumentById(resourceId, resourceType).subscribe(document => {
        if (document.contents !== undefined) {
          let file = new File([window.atob(String(document.contents))], document.name);
          let link = self.document.createElement('a');

          link.href = window.URL.createObjectURL(file);
          link.download = document.name;
          link.click();
        }
      });
    } else { // dataType is EntityAsset
      resourceType = Utils.getRawResourceType('asset', resourceType);

      this.assetService.getAssetById(resourceId, resourceType).subscribe(asset => {
        if (asset.componentIds !== undefined) {
          let file = new File([String(asset.componentIds)], asset.name);
          let link = self.document.createElement('a');

          link.href = window.URL.createObjectURL(file);
          link.download = asset.name;
          link.click();
        }
      });
    }
  }

  findInDataSource(dataSource: { item: string; value: string; }[], target: string): string {
    let result = dataSource.find(row => row.item === target)?.value;
    return (result === undefined) ? '' : result;
  }
}
