import { formatDate } from "@angular/common";

export class Utils {
  private static documentResourceTypes: string[] = [
    'Plaintext',
    'Encryption (on chain)',
    'Encryption (off chain)'
  ];

  private static documentTypes: string[] = [
    'Design',
    'Production',
    'Use',
    'Maintenance',
    'Transfer'
  ];

  private static assetResourceTypes: string[] = [
    'Plaintext',
    'Encryption'
  ];

  private static authSessionStatus: string[] = [
    'Unknown',
    'Allow',
    'Deny'
  ];

  static getResourceTypes(supertype: string): string[] {
    if (supertype === 'document') {
      return this.documentResourceTypes;
    } else if (supertype === 'asset') {
      return this.assetResourceTypes;
    } else {
      return [];
    }
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
