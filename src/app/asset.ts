export interface Asset {
  id: string;
  name: string;
  designDocumentId: string;
  isNamePublic: boolean;
  isDesignDocumentIdPublic: boolean;
  componentIds: string[];
}
