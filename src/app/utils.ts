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

  private static documentTypes: string[] = [
    'Design',
    'Production',
    'Use',
    'Maintenance',
    'Transfer'
  ];

  private static assetResourceTypes: Dictionary<string> = {
    plain: 'Plaintext',
    encrypted: 'Encryption'
  };

  private static authSessionStatus: string[] = [
    'Unknown',
    'Allow',
    'Deny'
  ];

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

  static getDocumentTypes(): string[] {
    return this.documentTypes;
  }

  static getAuthSessionStatus(): string[] {
    return this.authSessionStatus;
  }

  static formatDate(date: string): string {
    return formatDate(date, 'long', 'en-US');
  }
}
