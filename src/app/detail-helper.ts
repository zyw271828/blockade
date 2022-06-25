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
      { item: 'ResourceId', value: row.resourceId },
      { item: 'Name', value: row.name === undefined ? this.mask : row.name },
      { item: 'ResourceType', value: row.resourceType },
      { item: 'Hash', value: row.hash }
    ];

    if (row.resourceType !== Utils.getResourceTypes('document')[0]) {
      content.push({ item: 'CiphertextHash', value: row.ciphertextHash });
    }

    content.push({ item: 'Size', value: String(row.size) });

    if (row.resourceType !== Utils.getResourceTypes('document')[0]) {
      content.push({ item: 'CiphertextSize', value: String(row.ciphertextSize) });
    }

    content.push(
      { item: 'Creator', value: row.creator },
      { item: 'CreationTime', value: row.creationTime },
      { item: 'DocumentType', value: row.documentType === undefined ? this.mask : row.documentType },
      { item: 'PrecedingDocumentId', value: row.precedingDocumentId === undefined ? this.mask : row.precedingDocumentId },
      { item: 'HeadDocumentId', value: row.headDocumentId === undefined ? this.mask : row.headDocumentId },
      { item: 'EntityAssetId', value: row.entityAssetId === undefined ? this.mask : row.entityAssetId }
    );

    this.dialog.open(component, {
      data: {
        title: 'Detail',
        content: content
      }
    });
  }

  showAssetDetail(row: AssetQueryResultTableItem | AuthRecordTableItem, component: ComponentType<any>) {
    if (row.name === undefined
      || row.designDocumentId === undefined) {
      this.assetService?.getAssetById(row.resourceId, Utils.getRawResourceType('asset', row.resourceType)).subscribe((asset) => {
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
      { item: 'ResourceId', value: row.resourceId },
      { item: 'Name', value: row.name === undefined ? this.mask : row.name },
      { item: 'ResourceType', value: row.resourceType },
      { item: 'Hash', value: row.hash }
    ];

    if (row.resourceType !== Utils.getResourceTypes('asset')[0]) {
      content.push({ item: 'CiphertextHash', value: row.ciphertextHash });
    }

    content.push({ item: 'Size', value: String(row.size) });

    if (row.resourceType !== Utils.getResourceTypes('asset')[0]) {
      content.push({ item: 'CiphertextSize', value: String(row.ciphertextSize) });
    }

    content.push(
      { item: 'Creator', value: row.creator },
      { item: 'CreationTime', value: row.creationTime },
      { item: 'DesignDocumentId', value: row.designDocumentId === undefined ? this.mask : row.designDocumentId }
    );

    this.dialog.open(component, {
      data: {
        title: 'Detail',
        content: content
      }
    });
  }
}
