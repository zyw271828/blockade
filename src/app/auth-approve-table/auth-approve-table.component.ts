import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Utils } from '../utils';
import { AuthApproveTableDataSource, AuthApproveTableItem } from './auth-approve-table-datasource';

@Component({
  selector: 'app-auth-approve-table',
  templateUrl: './auth-approve-table.component.html',
  styleUrls: ['./auth-approve-table.component.css']
})
export class AuthApproveTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<AuthApproveTableItem>;
  dataSource: AuthApproveTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'resourceID',
    'resourceType',
    'name',
    'authSessionID',
    'operation'
  ];

  authRequestStatus: String[] = Utils.getAuthRequestStatus();

  constructor() {
    this.dataSource = new AuthApproveTableDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  allowAuthSession(authSessionID: string) {
    // TODO: allow auth request by authSessionID
  }

  denyAuthSession(authSessionID: string) {
    // TODO: deny auth request by authSessionID
  }
}
