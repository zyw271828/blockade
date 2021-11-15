export interface AssetMetadata {
  "resourceType": number;
  "resourceID": string;
  "hash": string;
  "size": number;
  "extensions": {
    "dataType": string;
    "designDocumentID": string;
    "name": string;
  };
  "creator": string;
  "timestamp": string;
  "hashStored": string;
  "sizeStored": number;
}
