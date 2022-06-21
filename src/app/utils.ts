import { formatDate } from '@angular/common';

interface Dictionary<T> {
  [key: string]: T;
}

export class Utils {
  private static documentResourceTypes: Dictionary<string> = {
    Plain: 'Plaintext',
    Encrypted: 'Encryption (on chain)',
    Offchain: 'Encryption (off chain)'
  };

  private static documentTypes: Dictionary<string> = {
    DesignDocument: 'Design',
    ProductionDocument: 'Production',
    TransferDocument: 'Transfer',
    UsageDocument: 'Usage',
    RepairDocument: 'Repair'
  };

  private static assetResourceTypes: Dictionary<string> = {
    Plain: 'Plaintext',
    Encrypted: 'Encryption'
  };

  private static dataTypes: Dictionary<string> = {
    Document: 'Document',
    EntityAsset: 'EntityAsset'
  };

  private static authSessionStatuses: Dictionary<string> = {
    Pending: 'Unknown',
    Approved: 'Allow',
    Rejected: 'Deny'
  };

  static mask: string = '***';

  static getResourceType(metaType: string, resourceType: string): string {
    if (metaType === 'document') {
      return this.documentResourceTypes[resourceType];
    } else if (metaType === 'asset') {
      return this.assetResourceTypes[resourceType];
    } else {
      return '';
    }
  }

  static getResourceTypes(metaType: string): string[] {
    let resourceTypes: string[] = [];

    if (metaType === 'document') {
      Object.entries(this.documentResourceTypes).forEach(
        ([_, value]) => resourceTypes.push(value)
      );
    } else if (metaType === 'asset') {
      Object.entries(this.assetResourceTypes).forEach(
        ([_, value]) => resourceTypes.push(value)
      );
    }

    return resourceTypes;
  }

  static getRawResourceType(metaType: string, resourceType: string): string {
    let rawResourceType;

    if (metaType === 'document') {
      rawResourceType = Object.keys(this.documentResourceTypes).find(key => this.documentResourceTypes[key] === resourceType);
    } else if (metaType === 'asset') {
      rawResourceType = Object.keys(this.assetResourceTypes).find(key => this.assetResourceTypes[key] === resourceType);
    }

    return rawResourceType === undefined ? resourceType : rawResourceType;
  }

  static getDocumentType(documentType: string): string {
    return this.documentTypes[documentType];
  }

  static getDocumentTypes(): string[] {
    let documentTypes: string[] = [];

    Object.entries(this.documentTypes).forEach(
      ([_, value]) => documentTypes.push(value)
    );

    return documentTypes;
  }

  static getRawDocumentType(documentType: string): string {
    let rawDocumentType = Object.keys(this.documentTypes).find(key => this.documentTypes[key] === documentType);

    return rawDocumentType === undefined ? documentType : rawDocumentType;
  }

  static getDataType(dataType: string): string {
    return this.dataTypes[dataType];
  }

  static getDataTypes(): string[] {
    let dataTypes: string[] = [];

    Object.entries(this.dataTypes).forEach(
      ([_, value]) => dataTypes.push(value)
    );

    return dataTypes;
  }

  static getRawDataType(dataType: string): string {
    let rawDataType = Object.keys(this.dataTypes).find(key => this.dataTypes[key] === dataType);

    return rawDataType === undefined ? dataType : rawDataType;
  }

  static getAuthSessionStatus(authSessionStatus: string): string {
    return this.authSessionStatuses[authSessionStatus];
  }

  static getAuthSessionStatuses(): string[] {
    let authSessionStatuses: string[] = [];

    Object.entries(this.authSessionStatuses).forEach(
      ([_, value]) => authSessionStatuses.push(value)
    );

    return authSessionStatuses;
  }

  static getRawAuthSessionStatus(authSessionStatus: string): string {
    let rawAuthSessionStatus = Object.keys(this.authSessionStatuses).find(key => this.authSessionStatuses[key] === authSessionStatus);

    return rawAuthSessionStatus === undefined ? authSessionStatus : rawAuthSessionStatus;
  }

  static formatDate(date: string): string {
    return formatDate(date, 'long', 'en-US');
  }
}
