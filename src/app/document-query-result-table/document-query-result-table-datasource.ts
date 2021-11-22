import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { forkJoin, merge, Observable, of as observableOf } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DocumentQueryComponent } from '../document-query/document-query.component';
import { DocumentService } from '../document.service';
import { Utils } from '../utils';

// Data model type
export interface DocumentQueryResultTableItem {
  id: number;
  resourceID: string;
  resourceType: string;
  name: string;
  hash: string;
  ciphertextHash: string;
  size: number;
  ciphertextSize: number;
  creator: string;
  creationTime: string;
  documentType: string;
  precedingDocumentID: string;
  headDocumentID: string;
  entityAssetID: string;
}

/**
 * Data source for the DocumentQueryResultTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DocumentQueryResultTableDataSource extends DataSource<DocumentQueryResultTableItem> {
  data: DocumentQueryResultTableItem[] = [];
  bookmark: string = '';
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(private documentQueryComponent: DocumentQueryComponent, private documentService: DocumentService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DocumentQueryResultTableItem[]> {
    // TODO: fix the page turning of MatPaginator
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getTableRecordData(this.sort!.direction === 'desc', this.paginator!.pageSize, this.bookmark)
            .pipe(map((tableRecordData) => {
              this.data = tableRecordData;
              return this.data;
            }));
        }))
        .pipe(
          mergeMap(result => result)
        );
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void { }

  private getTableItem(documentID: string, index: number): Observable<DocumentQueryResultTableItem> {
    return this.documentService.getDocumentMetadataById(documentID)
      .pipe(map((documentMetadata) => {
        return {
          id: index,
          resourceID: documentMetadata.resourceID,
          resourceType: Utils.getResourceTypes('document')[documentMetadata.resourceType],
          name: documentMetadata.extensions.name,
          hash: documentMetadata.hash,
          ciphertextHash: documentMetadata.hashStored,
          size: documentMetadata.size,
          ciphertextSize: documentMetadata.sizeStored,
          creator: documentMetadata.creator,
          creationTime: documentMetadata.timestamp,
          documentType: documentMetadata.extensions.documentType,
          precedingDocumentID: documentMetadata.extensions.precedingDocumentID,
          headDocumentID: documentMetadata.extensions.headDocumentID,
          entityAssetID: documentMetadata.extensions.entityAssetID
        };
      }));
  }

  private getTableRecordData(isLatestFirst: boolean, pageSize: number, bookmark: string): Observable<DocumentQueryResultTableItem[]> {
    let index = 1;
    let documentIDs: Observable<string[]>;

    if (this.documentQueryComponent.currentQueryMethod === this.documentQueryComponent.queryMethods[0]) {
      // ID query
      // TODO: filter resourceType
      documentIDs = this.documentService.queryDocumentIDs(
        isLatestFirst,
        pageSize,
        bookmark,
        this.documentQueryComponent.documentIDQueryForm.get('resourceID')?.value
      )
        .pipe(map((tableRecordData) => {
          this.bookmark = tableRecordData.bookmark;
          return tableRecordData.IDs;
        }));
    } else {
      // Conditional query
      let formValues = [];

      for (let key in this.documentQueryComponent.documentConditionalQueryForm.value) {
        if (key.startsWith('time')) { // time, timeAfterInclusive, timeBeforeExclusive
          formValues.push(this.documentQueryComponent.documentConditionalQueryForm.value[key]?.toJSON());
        } else {
          formValues.push(this.documentQueryComponent.documentConditionalQueryForm.value[key]);
        }
      }

      documentIDs = this.documentService.queryDocumentIDs(
        isLatestFirst,
        pageSize,
        bookmark,
        ...formValues
      )
        .pipe(map((tableRecordData) => {
          this.bookmark = tableRecordData.bookmark;
          return tableRecordData.IDs;
        }));
    }

    return documentIDs
      .pipe(map((documentIDs) => {
        return documentIDs.map(documentID => {
          return this.getTableItem(documentID, index++);
        });
      }))
      .pipe(map((tableItems) => {
        return forkJoin(tableItems);
      }))
      .pipe(
        mergeMap(result => result)
      );
  }
}
