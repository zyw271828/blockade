import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AssetService } from '../asset.service';
import { AuthService } from '../auth.service';
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
      if (row.resourceType != Utils.getRawDocumentType(Utils.getResourceTypes('document')[0])
        && (row.name === undefined
          || row.documentType === undefined
          || row.precedingDocumentId === undefined
          || row.headDocumentId === undefined
          || row.entityAssetId === undefined)) {
        this.documentService.getDocumentPropertiesById(row.resourceId).subscribe((documentProperties) => {
          if (row.name === undefined) {
            row.name = documentProperties.name;
          }
          if (row.documentType === undefined) {
            row.documentType = documentProperties.documentType;
          }
          if (row.precedingDocumentId === undefined) {
            row.precedingDocumentId = documentProperties.precedingDocumentId;
          }
          if (row.headDocumentId === undefined) {
            row.headDocumentId = documentProperties.headDocumentId;
          }
          if (row.entityAssetId === undefined) {
            row.entityAssetId = documentProperties.entityAssetId;
          }
        });

        this.openDetailDialog(row);
      } else { // row.name, row.documentType, row.precedingDocumentId, row.headDocumentId, row.entityAssetId are not undefined
        this.openDetailDialog(row);
      }
    } else { // dataType is EntityAsset
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
  }

  openDetailDialog(row: AuthRecordTableItem) {
    let content = [
      { item: 'DataType', value: row.dataType },
      { item: 'ResourceId', value: row.resourceId },
      { item: 'Name', value: row.name === undefined ? this.mask : row.name },
      { item: 'ResourceType', value: row.resourceType },
      { item: 'Hash', value: row.hash },
      { item: 'CiphertextHash', value: row.ciphertextHash },
      { item: 'Size', value: row.size },
      { item: 'CiphertextSize', value: row.ciphertextSize },
      { item: 'Creator', value: row.creator },
      { item: 'CreationTime', value: row.creationTime }
    ];

    if (row.dataType === Utils.getDataTypes()[0]) { // dataType is Document
      content.push(
        { item: 'DocumentType', value: row.documentType === undefined ? this.mask : row.documentType },
        { item: 'PrecedingDocumentId', value: row.precedingDocumentId === undefined ? this.mask : row.precedingDocumentId },
        { item: 'HeadDocumentId', value: row.headDocumentId === undefined ? this.mask : row.headDocumentId },
        { item: 'EntityAssetId', value: row.entityAssetId === undefined ? this.mask : row.entityAssetId }
      );
    } else { // dataType is EntityAsset
      content.push({ item: 'DesignDocumentId', value: row.designDocumentId === undefined ? this.mask : row.designDocumentId });
    }

    this.dialog.open(AuthRecordDetailDialog, {
      data: {
        title: 'Detail',
        content: content
      }
    });
  }
}

@Component({
  selector: 'auth-record-detail-dialog',
  templateUrl: './auth-record-detail-dialog.html',
  styleUrls: ['./auth-record-detail-dialog.css']
})
export class AuthRecordDetailDialog {
  displayedColumns: string[] = [
    'item',
    'value'
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private documentService: DocumentService, private assetService: AssetService) { }

  downloadResource(resourceId: string, dataType: string, resourceType: string) {
    if (dataType === Utils.getDataTypes()[0]) { // dataType is Document
      resourceType = Utils.getRawResourceType('document', resourceType);

      this.documentService.getDocumentById(resourceId, resourceType).subscribe(document => {
        if (document.contents !== undefined) {
          let file = new File([window.atob(String(document.contents))], document.name);
          let link = self.document.createElement('a');

          link.href = window.URL.createObjectURL(file);
          link.download = document.name;
          link.click();
        }
      });
    } else { // dataType is EntityAsset
      resourceType = Utils.getRawResourceType('asset', resourceType);

      this.assetService.getAssetById(resourceId, resourceType).subscribe(asset => {
        if (asset.componentIds !== undefined) {
          let file = new File([String(asset.componentIds)], asset.name);
          let link = self.document.createElement('a');

          link.href = window.URL.createObjectURL(file);
          link.download = asset.name;
          link.click();
        }
      });
    }
  }

  findInDataSource(dataSource: { item: string; value: string; }[], target: string): string {
    let result = dataSource.find(row => row.item === target)?.value;
    return (result === undefined) ? '' : result;
  }
}
