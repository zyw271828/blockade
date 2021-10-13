export interface Document {
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
