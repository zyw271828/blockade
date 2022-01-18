import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AssetQueryComponent } from '../asset-query/asset-query.component';
import { AssetService } from '../asset.service';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
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
    'resourceID',
    'resourceType',
    'name',
    'operation'
  ];

  mask: string = Utils.mask;

  constructor(private assetQueryComponent: AssetQueryComponent, private assetService: AssetService, public dialog: MatDialog) {
    this.dataSource = new AssetQueryResultTableDataSource(this.assetQueryComponent, this.assetService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  showDetail(row: AssetQueryResultTableItem) {
    if (row.name === undefined
      || row.designDocumentID === undefined) {
      row.resourceType = Utils.getRawResourceType('asset', row.resourceType);

      this.assetService.getAssetById(row.resourceID, row.resourceType).subscribe((asset) => {
        if (row.name === undefined) {
          row.name = asset.name;
        }
        if (row.designDocumentID === undefined) {
          row.designDocumentID = asset.designDocumentID;
        }
      });

      this.openDetailDialog(row);
    } else { // row.name, row.designDocumentID are not undefined
      this.openDetailDialog(row);
    }
  }

  openDetailDialog(row: AssetQueryResultTableItem) {
    this.dialog.open(AssetQueryResultDetailDialog, {
      data: {
        title: 'Detail',
        content: [
          { item: 'ResourceID', value: row.resourceID },
          { item: 'Name', value: row.name === undefined ? this.mask : row.name },
          { item: 'ResourceType', value: row.resourceType },
          { item: 'Hash', value: row.hash },
          { item: 'CiphertextHash', value: row.ciphertextHash },
          { item: 'Size', value: row.size },
          { item: 'CiphertextSize', value: row.ciphertextSize },
          { item: 'Creator', value: row.creator },
          { item: 'CreationTime', value: row.creationTime },
          { item: 'DesignDocumentID', value: row.designDocumentID === undefined ? this.mask : row.designDocumentID }
        ]
      }
    });
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private assetService: AssetService, public dialog: MatDialog) { }

  decryptAsset(resourceID: string, resourceType: string) {
    let authDialog = this.dialog.open(AuthDialogComponent, {
      width: '350px',
      data: {
        title: 'Authentication',
        resourceID: resourceID
      }
    });

    authDialog.afterClosed().subscribe(() => {
      resourceType = Utils.getRawResourceType('asset', resourceType);

      this.assetService.getAssetById(resourceID, resourceType, authDialog.componentInstance.keySwitchSessionID).subscribe((asset) => {
        // TODO: replace mask and open detail dialog
      });
    });
  }

  downloadAsset(resourceID: string, resourceType: string, keySwitchSessionID?: string) {
    resourceType = Utils.getRawResourceType('asset', resourceType);

    this.assetService.getAssetById(resourceID, resourceType, keySwitchSessionID).subscribe(asset => {
      let file = new File([], asset.name); // TODO: download asset by resourceID
      let link = self.document.createElement('a');

      link.href = window.URL.createObjectURL(file);;
      link.click();
    });
  }

  findInDataSource(dataSource: { item: string; value: string; }[], target: string): string {
    let result = dataSource.find(row => row.item === target)?.value;
    return (result === undefined) ? '' : result;
  }
}
