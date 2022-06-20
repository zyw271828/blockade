export interface AssetUpload {
  resourceType: string;
  name: string;
  isNamePublic: boolean;
  designDocumentId: string;
  isDesignDocumentIdPublic: boolean;
  componentIds: string[];
  policy: string;
}
