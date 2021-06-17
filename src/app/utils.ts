export class Utils {
  private static resourceTypes: String[] = [
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

  private static authRequestStatus: String[] = [
    'Allow',
    'Deny',
    'Unknown'
  ];

  static getResourceTypes(): String[] {
    return this.resourceTypes;
  }

  static getDocumentTypes(): String[] {
    return this.documentTypes;
  }

  static getAuthRequestStatus(): String[] {
    return this.authRequestStatus;
  }
}
