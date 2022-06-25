import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AssetQueryResultDetailDialog } from '../asset-query-result-table/asset-query-result-table.component';
import { AssetService } from '../asset.service';
import { AuthService } from '../auth.service';
import { DetailHelper } from '../detail-helper';
import { DocumentQueryResultDetailDialog } from '../document-query-result-table/document-query-result-table.component';
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

  mask: string = Utils.mask;

  authSessionStatuses: string[] = Utils.getAuthSessionStatuses();

  infinity: number = Number.MAX_SAFE_INTEGER;

  currentPageSize: number = 10;

  constructor(
    private authService: AuthService,
    private documentService: DocumentService,
    private assetService: AssetService,
    private resourceService: ResourceService,
    public dialog: MatDialog
  ) {
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
    if (row.dataType === Utils.getDataTypes()[0]) { // dataType is Document
      let detailHelper = new DetailHelper(this.dialog, this.documentService, undefined);

      detailHelper.showDocumentDetail(row, DocumentQueryResultDetailDialog);
    } else { // dataType is EntityAsset
      let detailHelper = new DetailHelper(this.dialog, undefined, this.assetService);

      detailHelper.showAssetDetail(row, AssetQueryResultDetailDialog);
    }
  }
}
