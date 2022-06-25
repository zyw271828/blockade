import { ComponentType } from "@angular/cdk/portal";
import { MatDialog } from "@angular/material/dialog";
import { AssetQueryResultTableItem } from "./asset-query-result-table/asset-query-result-table-datasource";
import { AssetService } from "./asset.service";
import { AuthRecordTableItem } from "./auth-record-table/auth-record-table-datasource";
import { DocumentQueryResultTableItem } from "./document-query-result-table/document-query-result-table-datasource";
import { DocumentService } from "./document.service";
import { Utils } from "./utils";

export class DetailHelper {
  mask: string = Utils.mask;

  constructor(public dialog: MatDialog, private documentService?: DocumentService, private assetService?: AssetService) { }

  showDocumentDetail(row: DocumentQueryResultTableItem | AuthRecordTableItem, component: ComponentType<any>) {
    if (row.resourceType != Utils.getRawDocumentType(Utils.getResourceTypes('document')[0])
      && (row.name === undefined
        || row.documentType === undefined
        || row.precedingDocumentId === undefined
        || row.headDocumentId === undefined
        || row.entityAssetId === undefined)) {
      this.documentService?.getDocumentPropertiesById(row.resourceId).subscribe((documentProperties) => {
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

      this.openDocumentDetailDialog(row, component);
    } else { // row.name, row.documentType, row.precedingDocumentId, row.headDocumentId, row.entityAssetId are not undefined
      this.openDocumentDetailDialog(row, component);
    }
  }

  openDocumentDetailDialog(row: DocumentQueryResultTableItem | AuthRecordTableItem, component: ComponentType<any>) {
    let content = [
      { item: '资源 ID', value: row.resourceId },
      { item: '名称', value: row.name === undefined ? this.mask : row.name },
      { item: '资源类型', value: row.resourceType },
      { item: '散列', value: row.hash }
    ];

    if (row.resourceType !== Utils.getResourceTypes('document')[0]) {
      content.push({ item: '密文散列', value: row.ciphertextHash });
    }

    content.push({ item: '大小', value: String(row.size) });

    if (row.resourceType !== Utils.getResourceTypes('document')[0]) {
      content.push({ item: '密文大小', value: String(row.ciphertextSize) });
    }

    content.push(
      { item: '创建者', value: row.creator },
      { item: '创建时间', value: row.creationTime },
      { item: '文档类型', value: row.documentType === undefined ? this.mask : row.documentType },
      { item: '前序文档 ID', value: row.precedingDocumentId === undefined ? this.mask : row.precedingDocumentId },
      { item: '头文档 ID', value: row.headDocumentId === undefined ? this.mask : row.headDocumentId },
      { item: '实体资产 ID', value: row.entityAssetId === undefined ? this.mask : row.entityAssetId }
    );

    this.dialog.open(component, {
      data: {
        title: '详细信息',
        content: content
      }
    });
  }

  showAssetDetail(row: AssetQueryResultTableItem | AuthRecordTableItem, component: ComponentType<any>) {
    if (row.name === undefined
      || row.designDocumentId === undefined) {
      row.resourceType = Utils.getRawResourceType('asset', row.resourceType);

      this.assetService?.getAssetById(row.resourceId, row.resourceType).subscribe((asset) => {
        if (row.name === undefined) {
          row.name = asset.name;
        }
        if (row.designDocumentId === undefined) {
          row.designDocumentId = asset.designDocumentId;
        }
      });

      this.openAssetDetailDialog(row, component);
    } else { // row.name, row.designDocumentId are not undefined
      this.openAssetDetailDialog(row, component);
    }
  }

  openAssetDetailDialog(row: AssetQueryResultTableItem | AuthRecordTableItem, component: ComponentType<any>) {
    let content = [
      { item: '资源 ID', value: row.resourceId },
      { item: '名称', value: row.name === undefined ? this.mask : row.name },
      { item: '资源类型', value: row.resourceType },
      { item: '散列', value: row.hash }
    ];

    if (row.resourceType !== Utils.getResourceTypes('asset')[0]) {
      content.push({ item: '密文散列', value: row.ciphertextHash });
    }

    content.push({ item: '大小', value: String(row.size) });

    if (row.resourceType !== Utils.getResourceTypes('asset')[0]) {
      content.push({ item: '密文大小', value: String(row.ciphertextSize) });
    }

    content.push(
      { item: '创建者', value: row.creator },
      { item: '创建时间', value: row.creationTime },
      { item: '设计文档 ID', value: row.designDocumentId === undefined ? this.mask : row.designDocumentId }
    );

    this.dialog.open(component, {
      data: {
        title: '详细信息',
        content: content
      }
    });
  }
}
