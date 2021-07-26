import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AssetUploadRecordTableDataSource, AssetUploadRecordTableItem } from './asset-upload-record-table-datasource';

import { Asset } from '../asset';
import { AssetService } from '../asset.service';

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
  data: Asset[] = [];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'resourceID',
    'resourceType',
    'name',
    'creationTime'
  ];

  constructor(private assetService: AssetService) {
    this.dataSource = new AssetUploadRecordTableDataSource();
  }

  ngOnInit(): void {
    this.getRecord();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  private getRecord(): void {
    this.data = [];
    this.assetService.getUploadRecord().subscribe(res => {
      for (let i of res.IDs) {
        this.assetService.getAsset(i).subscribe(resp => {
          this.data.push(resp);
        })
      }
    });
  }
}
