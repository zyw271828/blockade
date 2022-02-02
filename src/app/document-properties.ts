export interface DocumentProperties {
  id: string;
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
}