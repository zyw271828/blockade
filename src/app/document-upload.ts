export interface DocumentUpload {
  resourceType: string;
  documentType: string;
  isDocumentTypePublic: boolean;
  name: string;
  isNamePublic: boolean;
  entityAssetId: string;
  isEntityAssetIdPublic: boolean;
  precedingDocumentId: string;
  isPrecedingDocumentIdPublic: boolean;
  headDocumentId: string;
  isHeadDocumentIdPublic: boolean;
  contents: ArrayBuffer;
  policy: string;
}
