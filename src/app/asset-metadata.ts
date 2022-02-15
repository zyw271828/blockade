export interface AssetMetadata {
  resourceType: string;
  resourceId: string;
  hash: string;
  size: number;
  extensions: {
    dataType: string;
    designDocumentId: string;
    name: string;
  };
  creator: string;
  timestamp: string;
  hashStored: string;
  sizeStored: number;
}
