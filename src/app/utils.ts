import { formatDate } from "@angular/common";

interface Dictionary<T> {
  [key: string]: T;
}

export class Utils {
  private static documentResourceTypes: Dictionary<string> = {
    plain: 'Plaintext',
    encrypted: 'Encryption (on chain)',
    offchain: 'Encryption (off chain)'
  };

  private static documentTypes: Dictionary<string> = {
    designDocument: 'Design',
    productionDocument: 'Production',
    transferDocument: 'Transfer',
    usageDocument: 'Usage',
    repairDocument: 'Repair'
  };

  private static assetResourceTypes: Dictionary<string> = {
    plain: 'Plaintext',
    encrypted: 'Encryption'
  };

  private static authSessionStatuses: Dictionary<string> = {
    pending: 'Unknown',
    approved: 'Allow',
    rejected: 'Deny'
  };

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

  static formatDate(date: string): string {
    return formatDate(date, 'long', 'en-US');
  }
}
