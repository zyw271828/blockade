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

  private static authRequestStatus: string[] = [
    'Allow',
    'Deny',
    'Unknown'
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

  static getAuthRequestStatus(): string[] {
    return this.authRequestStatus;
  }

  static formatDate(date: string): string {
    return formatDate(date, 'long', 'en-US');
  }
}
