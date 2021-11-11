export interface DocumentMetadata {
  "resourceType": number;
  "resourceID": string;
  "hash": string;
  "size": number;
  "extensions": {
    "dataType": string;
    "documentType": string;
    "entityAssetID": string;
    "headDocumentID": string;
    "name": string;
    "precedingDocumentID": string;
  };
  "creator": string;
  "timestamp": string;
  "hashStored": string;
  "sizeStored": number;
}
