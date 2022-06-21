import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AuthService } from '../auth.service';
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
      { item: 'DataType', value: row.dataType },
      { item: 'ResourceId', value: row.resourceId },
      { item: 'Name', value: row.name },
      { item: 'ResourceType', value: row.resourceType },
      { item: 'Hash', value: row.hash },
      { item: 'CiphertextHash', value: row.ciphertextHash },
      { item: 'Size', value: row.size },
      { item: 'CiphertextSize', value: row.ciphertextSize },
      { item: 'Creator', value: row.creator },
      { item: 'CreationTime', value: row.creationTime }
    ];

    if (row.dataType === Utils.getRawDataType(Utils.getDataTypes()[0])) { // dataType is Document
      content.push(
        { item: 'DocumentType', value: row.documentType },
        { item: 'PrecedingDocumentId', value: row.precedingDocumentId },
        { item: 'HeadDocumentId', value: row.headDocumentId },
        { item: 'EntityAssetId', value: row.entityAssetId }
      );
    } else { // dataType is EntityAsset
      content.push({ item: 'DesignDocumentId', value: row.designDocumentId });
    }

    this.dialog.open(AuthRecordDetailDialog, {
      data: {
        title: 'Detail',
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  downloadDocument(resourceId: number) {
    // TODO: download document by resourceId
  }

  findInDataSource(dataSource: { item: string; value: string; }[], target: string): string {
    let result = dataSource.find(row => row.item === target)?.value;
    return (result === undefined) ? '' : result;
  }
}
