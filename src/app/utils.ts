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

  static getResourceTypes(): String[] {
    return this.resourceTypes;
  }

  static getDocumentTypes(): String[] {
    return this.documentTypes;
  }
}
