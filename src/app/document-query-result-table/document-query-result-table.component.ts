import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { DocumentQueryComponent } from '../document-query/document-query.component';
import { DocumentService } from '../document.service';
import { Utils } from '../utils';
import { DocumentQueryResultTableDataSource, DocumentQueryResultTableItem } from './document-query-result-table-datasource';

export interface DialogData {
  title: string;
  content: {
    item: string;
    value: string;
  }[];
}

@Component({
  selector: 'app-document-query-result-table',
  templateUrl: './document-query-result-table.component.html',
  styleUrls: ['./document-query-result-table.component.css']
})
export class DocumentQueryResultTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DocumentQueryResultTableItem>;
  dataSource: DocumentQueryResultTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'resourceID',
    'resourceType',
    'name',
    'operation'
  ];

  constructor(private documentQueryComponent: DocumentQueryComponent, private documentService: DocumentService, public dialog: MatDialog) {
    this.dataSource = new DocumentQueryResultTableDataSource(this.documentQueryComponent, this.documentService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  showDetail(row: DocumentQueryResultTableItem) {
    this.dialog.open(DocumentQueryResultDetailDialog, {
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
          { item: '文档类型', value: row.documentType },
          { item: '前序文档 ID', value: row.precedingDocumentID },
          { item: '头文档 ID', value: row.headDocumentID },
          { item: '实体资产 ID', value: row.entityAssetID }
        ]
      }
    });
  }
}

@Component({
  selector: 'document-query-result-detail-dialog',
  templateUrl: './document-query-result-detail-dialog.html',
  styleUrls: ['./document-query-result-detail-dialog.css']
})
export class DocumentQueryResultDetailDialog {
  displayedColumns: string[] = [
    'item',
    'value'
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  downloadDocument(resourceID: number) {
    // TODO: download document by resourceID
  }

  findInDataSource(dataSource: { item: string; value: string; }[], target: string): string {
    let result = dataSource.find(row => row.item === target)?.value;
    return (result === undefined) ? '' : result;
  }
}
