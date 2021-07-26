import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { Utils } from '../utils';
import { Auth} from '../auth';
import { AuthService } from '../auth.service';
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
  data: Auth[] = [];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'resourceID',
    'resourceType',
    'name',
    'authSessionID',
    'operation'
  ];

  authRequestStatus: string[] = Utils.getAuthRequestStatus();

  constructor(private _snackBar: MatSnackBar, private authService: AuthService) {
    this.dataSource = new AuthApproveTableDataSource();
  }

  ngOnInit(): void {
    this.getRecord();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  allowAuthSession(authSessionID: string) {
    this.authService.setAuthResult(authSessionID, true).subscribe();
    this._snackBar.open('Allowed: ' + authSessionID, 'DISMISS', {
      duration: 5000
    });
  }

  denyAuthSession(authSessionID: string) {
    this.authService.setAuthResult(authSessionID, false).subscribe();
    this._snackBar.open('Denied: ' + authSessionID, 'DISMISS', {
      duration: 5000
    });
  }

  private getRecord(): void {
    this.data = [];
    this.authService.getPendingRecord().subscribe(res => {
      for (let i of res.resourceIDs) {
        // TODO: determine the type of the resource and get its data accordingly.
      }
    });
  }
}
