import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AssetQueryResultTableDataSource, AssetQueryResultTableItem } from './asset-query-result-table-datasource';

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
    this.dialog.open(AssetQueryResultDetailDialog, {
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
  selector: 'asset-query-result-detail-dialog',
  templateUrl: './asset-query-result-detail-dialog.html',
  styleUrls: ['./asset-query-result-detail-dialog.css']
})
export class AssetQueryResultDetailDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  downloadAsset(resourceID: number) {
    // TODO: download asset by resourceID 
  }
}
