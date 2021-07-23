import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AssetUploadRecordTableDataSource, AssetUploadRecordTableItem } from './asset-upload-record-table-datasource';

@Component({
  selector: 'app-asset-upload-record-table',
  templateUrl: './asset-upload-record-table.component.html',
  styleUrls: ['./asset-upload-record-table.component.css']
})
export class AssetUploadRecordTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<AssetUploadRecordTableItem>;
  dataSource: AssetUploadRecordTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'resourceID',
    'resourceType',
    'name',
    'creationTime'
  ];

  constructor() {
    this.dataSource = new AssetUploadRecordTableDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}