export interface Asset {
  id: string;
  name: string;
  designDocumentID: string;
  isNamePublic: boolean;
  isDesignDocumentIDPublic: boolean;
  componentIDs: string[];
}
