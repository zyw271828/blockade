import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AssetQueryComponent } from '../asset-query/asset-query.component';
import { AssetService } from '../asset.service';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { DetailHelper } from '../detail-helper';
import { Utils } from '../utils';
import { AssetQueryResultTableDataSource, AssetQueryResultTableItem } from './asset-query-result-table-datasource';

export interface DialogData {
  title: string;
  content: {
    item: string;
    value: string;
  }[];
}

@Component({
  selector: 'app-asset-query-result-table',
  templateUrl: './asset-query-result-table.component.html',
  styleUrls: ['./asset-query-result-table.component.css']
})
export class AssetQueryResultTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<AssetQueryResultTableItem>;
  dataSource: AssetQueryResultTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'resourceId',
    'resourceType',
    'name',
    'operation'
  ];

  mask: string = Utils.mask;

  infinity: number = Number.MAX_SAFE_INTEGER;

  currentPageSize: number = 10;

  constructor(private assetQueryComponent: AssetQueryComponent, private assetService: AssetService, public dialog: MatDialog) {
    this.dataSource = new AssetQueryResultTableDataSource(this.assetQueryComponent, this.assetService);
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

  showDetail(row: AssetQueryResultTableItem) {
    let detailHelper = new DetailHelper(this.dialog, undefined, this.assetService);

    detailHelper.showAssetDetail(row, AssetQueryResultDetailDialog);
  }
}

@Component({
  selector: 'asset-query-result-detail-dialog',
  templateUrl: './asset-query-result-detail-dialog.html',
  styleUrls: ['./asset-query-result-detail-dialog.css']
})
export class AssetQueryResultDetailDialog {
  displayedColumns: string[] = [
    'item',
    'value'
  ];

  resourceTypes: string[] = Utils.getResourceTypes('asset');

  mask: string = Utils.mask;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private assetService: AssetService, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  decryptAsset(dataSource: { item: string; value: string; }[]) {
    let authDialog = this.dialog.open(AuthDialogComponent, {
      width: '350px',
      data: {
        title: 'Authentication',
        resourceId: this.findInDataSource(dataSource, 'ResourceId')
      }
    });

    authDialog.afterClosed().subscribe(() => {
      let content: { item: string; value: string; }[] = [];

      this.assetService.getAssetById(
        this.findInDataSource(dataSource, 'ResourceId'),
        Utils.getRawResourceType('asset', this.findInDataSource(dataSource, 'ResourceType')),
        authDialog.componentInstance.keySwitchSessionId
      ).subscribe((asset) => {
        dataSource.forEach(
          ({ item, value }) => {
            if (value === this.mask) {
              if (item === 'Name') {
                value = asset.name === undefined ? this.mask : asset.name;
              }
              if (item === 'DesignDocumentId') {
                value = asset.designDocumentId === undefined ? this.mask : asset.designDocumentId;
              }
            }

            content.push({ item, value });
          }
        );

        this.dialog.open(AssetQueryResultDetailDialog, {
          data: {
            title: 'Detail',
            content: content
          }
        });
      });
    });
  }

  downloadAsset(resourceId: string, resourceType: string, keySwitchSessionId?: string) {
    resourceType = Utils.getRawResourceType('asset', resourceType);

    this.assetService.getAssetById(resourceId, resourceType, keySwitchSessionId).subscribe(asset => {
      if (asset.componentIds !== undefined) {
        let file = new File([String(asset.componentIds)], asset.name);
        let link = self.document.createElement('a');

        link.href = window.URL.createObjectURL(file);
        link.download = asset.name;
        link.click();
      } else { // asset.componentIds is undefined
        let authDialog = this.dialog.open(AuthDialogComponent, {
          width: '350px',
          data: {
            title: 'Authentication',
            resourceId: resourceId
          }
        });

        authDialog.afterClosed().subscribe(() => {
          this.assetService.getAssetById(resourceId, resourceType, authDialog.componentInstance.keySwitchSessionId).subscribe(asset => {
            if (asset.componentIds !== undefined) {
              let file = new File([String(asset.componentIds)], asset.name);
              let link = self.document.createElement('a');

              link.href = window.URL.createObjectURL(file);
              link.download = asset.name;
              link.click();
            } else { // asset.componentIds is undefined
              this._snackBar.open('Failed to download asset', 'DISMISS', {
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
