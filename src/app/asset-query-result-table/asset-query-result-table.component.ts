import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AssetQueryComponent } from '../asset-query/asset-query.component';
import { AssetService } from '../asset.service';
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

  constructor(private assetQueryComponent: AssetQueryComponent, private assetService: AssetService, public dialog: MatDialog) {
    this.dataSource = new AssetQueryResultTableDataSource(this.assetQueryComponent, this.assetService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  showDetail(row: AssetQueryResultTableItem) {
    this.dialog.open(AssetQueryResultDetailDialog, {
      data: {
        title: '详细信息',
        content: [
          { item: '资源 ID', value: row.resourceID },
          { item: '名称', value: row.name },
          { item: '资源类型', value: row.resourceType },
          { item: '散列', value: row.hash },
          { item: '密文散列', value: row.ciphertextHash },
          { item: '大小', value: row.size },
          { item: '密文大小', value: row.ciphertextSize },
          { item: '创建者', value: row.creator },
          { item: '创建时间', value: Utils.formatDate(row.creationTime) },
          { item: '设计文档 ID', value: row.designDocumentID }
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  downloadAsset(resourceID: number) {
    // TODO: download asset by resourceID
  }

  findInDataSource(dataSource: { item: string; value: string; }[], target: string): string {
    let result = dataSource.find(row => row.item === target)?.value;
    return (result === undefined) ? '' : result;
  }
}
