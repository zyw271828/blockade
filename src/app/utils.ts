export class Utils {
  private static documentResourceTypes: String[] = [
    'Plaintext',
    'Encryption (on chain)',
    'Encryption (off chain)'
  ];

  private static documentTypes: String[] = [
    'Design',
    'Production',
    'Use',
    'Maintenance',
    'Transfer'
  ];

  private static assetResourceTypes: String[] = [
    'Plaintext',
    'Encryption'
  ];

  private static authRequestStatus: String[] = [
    'Allow',
    'Deny',
    'Unknown'
  ];

  static getResourceTypes(supertype: string): String[] {
    if (supertype === 'document') {
      return this.documentResourceTypes;
    } else if (supertype === 'asset') {
      return this.assetResourceTypes;
    } else {
      return [];
    }
  }

  static getDocumentTypes(): String[] {
    return this.documentTypes;
  }

  static getAuthRequestStatus(): String[] {
    return this.authRequestStatus;
  }
}
