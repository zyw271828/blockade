export interface Document {
  id: string;
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
}
