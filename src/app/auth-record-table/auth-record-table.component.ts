import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AuthService } from '../auth.service';
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
    'resourceID',
    'resourceType',
    'name',
    'authSessionID',
    'status',
    'operation'
  ];

  authSessionStatus: string[] = Utils.getAuthSessionStatus();

  constructor(private authService: AuthService, public dialog: MatDialog) {
    this.dataSource = new AuthRecordTableDataSource(this.authService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  showDetail(row: AuthRecordTableItem) {
    this.dialog.open(AuthRecordDetailDialog, {
      data: {
        title: '详细信息',
        content: [
          { item: '资源 ID', value: row.resourceID },
          { item: '名称', value: row.name },
          { item: '资源类型', value: row.resourceType },
          { item: '散列', value: row.hash },
          { item: '密文散列', value: row.ciphertextHash },
          { item: '大小', value: row.size },
          { item: '密文大小', value: row.ciphertextSize },
          { item: '创建者', value: row.creator },
          { item: '创建时间', value: Utils.formatDate(row.creationTime) },
          { item: '文档类型', value: row.documentType },
          { item: '前序文档 ID', value: row.precedingDocumentID },
          { item: '头文档 ID', value: row.headDocumentID },
          { item: '实体资产 ID', value: row.entityAssetID }
        ]
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  downloadDocument(resourceID: number) {
    // TODO: download document by resourceID
  }

  findInDataSource(dataSource: { item: string; value: string; }[], target: string): string {
    let result = dataSource.find(row => row.item === target)?.value;
    return (result === undefined) ? '' : result;
  }
}
