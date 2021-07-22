import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
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

  constructor(public dialog: MatDialog) {
    this.dataSource = new AssetQueryResultTableDataSource();
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

    this.dialog.open(AssetQueryResultDetailDialog, {
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
