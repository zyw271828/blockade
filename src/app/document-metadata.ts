export interface DocumentMetadata {
  resourceType: string;
  resourceId: string;
  hash: string;
  size: number;
  extensions: {
    dataType: string;
    documentType: string;
    entityAssetId: string;
    headDocumentId: string;
    name: string;
    precedingDocumentId: string;
  };
  creator: string;
  timestamp: string;
  hashStored: string;
  sizeStored: number;
}
