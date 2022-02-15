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
    'resourceId',
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
      || row.designDocumentId === undefined) {
      row.resourceType = Utils.getRawResourceType('asset', row.resourceType);

      this.assetService.getAssetById(row.resourceId, row.resourceType).subscribe((asset) => {
        if (row.name === undefined) {
          row.name = asset.name;
        }
        if (row.designDocumentId === undefined) {
          row.designDocumentId = asset.designDocumentId;
        }
      });

      this.openDetailDialog(row);
    } else { // row.name, row.designDocumentId are not undefined
      this.openDetailDialog(row);
    }
  }

  openDetailDialog(row: AssetQueryResultTableItem) {
    this.dialog.open(AssetQueryResultDetailDialog, {
      data: {
        title: '详细信息',
        content: [
          { item: '资源 ID', value: row.resourceId },
          { item: '名称', value: row.name === undefined ? this.mask : row.name },
          { item: '资源类型', value: row.resourceType },
          { item: '散列', value: row.hash },
          { item: '密文散列', value: row.ciphertextHash },
          { item: '大小', value: row.size },
          { item: '密文大小', value: row.ciphertextSize },
          { item: '创建者', value: row.creator },
          { item: '创建时间', value: row.creationTime },
          { item: '设计文档 ID', value: row.designDocumentId === undefined ? this.mask : row.designDocumentId }
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

  mask: string = Utils.mask;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private assetService: AssetService, public dialog: MatDialog) { }

  decryptAsset(dataSource: { item: string; value: string; }[]) {
    let authDialog = this.dialog.open(AuthDialogComponent, {
      width: '350px',
      data: {
        title: '身份验证',
        resourceId: this.findInDataSource(dataSource, '资源 ID')
      }
    });

    authDialog.afterClosed().subscribe(() => {
      let content: { item: string; value: string; }[] = [];

      this.assetService.getAssetById(
        this.findInDataSource(dataSource, '资源 ID'),
        Utils.getRawResourceType('asset', this.findInDataSource(dataSource, '资源类型')),
        authDialog.componentInstance.keySwitchSessionId
      ).subscribe((asset) => {
        dataSource.forEach(
          ({ item, value }) => {
            if (value === this.mask) {
              if (item === '名称') {
                value = asset.name === undefined ? this.mask : asset.name;
              }
              if (item === '设计文档 ID') {
                value = asset.designDocumentId === undefined ? this.mask : asset.designDocumentId;
              }
            }

            content.push({ item, value });
          }
        );

        this.dialog.open(AssetQueryResultDetailDialog, {
          data: {
            title: '详细信息',
            content: content
          }
        });
      });
    });
  }

  downloadAsset(resourceId: string, resourceType: string, keySwitchSessionId?: string) {
    resourceType = Utils.getRawResourceType('asset', resourceType);

    this.assetService.getAssetById(resourceId, resourceType, keySwitchSessionId).subscribe(asset => {
      let file = new File([], asset.name); // TODO: download asset by resourceId
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
