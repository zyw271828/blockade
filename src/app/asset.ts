export interface Asset {
  ID: number;
  resourceType: string;
  name: string;
  designDocumentID: string;
  componentIDs: number[];
  policy: string;
  isNamePublic: boolean;
  isDesignDocumentIDPublic: boolean;
}
export interface UploadResult {
  resourceID: string;
  transactionID: string;
  symmetricKeyMaterial: string;
}

export interface QueryResult {
  IDs: string[];
  bookmark: string;
}
