export interface Document {
  id: Number;
  resourceType: string;
  documentType: string;
  isDocumentTypePublic: boolean;
  name: string;
  isNamePublic: boolean;
  entityAssetID: string;
  isEntityAssetIDPublic: boolean;
  precedingDocumentID: string;
  isPrecedingDocumentIDPublic: boolean;
  headDocumentID: string;
  isHeadDocumentIDPublic: boolean;
  content: string;
  policy: string;
}

export interface UploadResult {
  resourceID: string;
  transactionID: string;
  symmetricKeyMaterial: string;
}
