import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
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

  authRequestStatus: string[] = Utils.getAuthRequestStatus();

  constructor(public dialog: MatDialog) {
    this.dataSource = new AuthRecordTableDataSource();
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

    this.dialog.open(AuthRecordDetailDialog, {
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
