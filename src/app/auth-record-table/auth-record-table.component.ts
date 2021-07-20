import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Utils } from '../utils';
import { AuthRecordTableDataSource, AuthRecordTableItem } from './auth-record-table-datasource';

export interface DialogData {
  title: string;
  resourceID: number;
  name: string;
  resourceType: string;
  hash: string;
  ciphertextHash: string;
  size: string;
  ciphertextSize: string;
  creator: string;
  creationTime: Date;
  documentType: string;
  precedingDocumentID: number;
  headDocumentID: number;
  entityAssetID: number;
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

  authRequestStatus: String[] = Utils.getAuthRequestStatus();

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
    this.dialog.open(AuthRecordDetailDialog, {
      data: {
        title: 'Detail',
        resourceID: resourceID,
        name: '',
        resourceType: '',
        hash: '',
        ciphertextHash: '',
        size: '',
        ciphertextSize: '',
        creator: '',
        creationTime: new Date(),
        documentType: '',
        precedingDocumentID: '',
        headDocumentID: '',
        entityAssetID: ''
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  downloadDocument(resourceID: number) {
    // TODO: download document by resourceID 
  }
}
