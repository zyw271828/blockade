import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AuthResponse } from '../auth-response';
import { AuthService } from '../auth.service';
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
    'resourceId',
    'resourceType',
    'name',
    'authSessionId',
    'operation'
  ];

  authSessionStatuses: string[] = Utils.getAuthSessionStatuses();

  constructor(private authService: AuthService, private _snackBar: MatSnackBar) {
    this.dataSource = new AuthApproveTableDataSource(this.authService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  allowAuthSession(authSessionId: string) {
    this.authService.responseAuth({
      authSessionId: authSessionId,
      result: true
    } as AuthResponse).subscribe(resourceCreationInfo => {
      this._snackBar.open('已允许：'
        + authSessionId.match(/.{1,4}/g)?.join(' ')
        + '\n交易 ID：'
        + resourceCreationInfo.transactionId.match(/.{1,4}/g)?.join(' '), '关闭', {
        duration: 5000,
        panelClass: ['result-snackbar']
      });
    });
  }

  denyAuthSession(authSessionId: string) {
    this.authService.responseAuth({
      authSessionId: authSessionId,
      result: false
    } as AuthResponse).subscribe(resourceCreationInfo => {
      this._snackBar.open('已拒绝：'
        + authSessionId.match(/.{1,4}/g)?.join(' ')
        + '\n交易 ID：'
        + resourceCreationInfo.transactionId.match(/.{1,4}/g)?.join(' '), '关闭', {
        duration: 5000,
        panelClass: ['result-snackbar']
      });
    });
  }
}
