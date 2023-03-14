import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { forkJoin, merge, Observable, of as observableOf } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CitRecord } from '../cit-record';
import { DocumentQueryComponent } from '../document-query/document-query.component';
import { DocumentService } from '../document.service';
import { Utils } from '../utils';

// Data model type
export interface DocumentQueryResultTableItem {
  id: number;
  resourceId: string;
  resourceType: string;
  name: string;
  hash: string;
  ciphertextHash: string;
  size: number;
  ciphertextSize: number;
  creator: string;
  creationTime: string;
  documentType: string;
  precedingDocumentId: string;
  headDocumentId: string;
  entityAssetId: string;
  device: string;
  activity: string;
}

interface Dictionary<T> {
  [key: string]: T;
}

/**
 * Data source for the DocumentQueryResultTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DocumentQueryResultTableDataSource extends DataSource<DocumentQueryResultTableItem> {
  data: DocumentQueryResultTableItem[] = [];
  bookmarks: string[] = [''];
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
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getTableRecordData(this.sort!.direction === 'desc', this.paginator!.pageSize, this.bookmarks[this.paginator!.pageIndex])
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

  private getTableItem(documentId: string, index: number): Observable<DocumentQueryResultTableItem> {
    return this.documentService.getDocumentMetadataById(documentId)
      .pipe(map((documentMetadata) => {
        let citRecord: CitRecord = Utils.getCitRecord(documentMetadata.extensions.name);

        return {
          id: index,
          resourceId: documentMetadata.resourceId,
          resourceType: Utils.getResourceType('document', documentMetadata.resourceType),
          name: citRecord.id,
          hash: documentMetadata.hash,
          ciphertextHash: documentMetadata.hashStored,
          size: documentMetadata.size,
          ciphertextSize: documentMetadata.sizeStored,
          creator: citRecord.user,
          creationTime: Utils.formatDate(citRecord.date),
          documentType: Utils.getDocumentType(documentMetadata.extensions.documentType),
          precedingDocumentId: documentMetadata.extensions.precedingDocumentId,
          headDocumentId: documentMetadata.extensions.headDocumentId,
          entityAssetId: documentMetadata.extensions.entityAssetId,
          device: citRecord.pc,
          activity: citRecord.activity
        };
      }));
  }

  private getTableRecordData(isLatestFirst: boolean, pageSize: number, bookmark: string): Observable<DocumentQueryResultTableItem[]> {
    let index = 1;
    let documentIds: Observable<string[]>;

    if (this.documentQueryComponent.currentQueryMethod === this.documentQueryComponent.queryMethods[0]) {
      // ID query
      documentIds = observableOf([String(this.documentQueryComponent.documentIdQueryForm.get('resourceId')?.value)]);
    } else {
      // Conditional query
      let formValues = [];

      for (let key in this.documentQueryComponent.documentConditionalQueryForm.value) {
        if (key.startsWith('time')) { // time, timeAfterInclusive, timeBeforeExclusive
          formValues.push((this.documentQueryComponent.documentConditionalQueryForm.value as Dictionary<Date>)[key]?.toJSON());
        } else if (key === 'documentType' && (this.documentQueryComponent.documentConditionalQueryForm.value as Dictionary<string>)[key] !== null) {
          formValues.push(Utils.getRawDocumentType((this.documentQueryComponent.documentConditionalQueryForm.value as Dictionary<string>)[key]));
        } else {
          formValues.push((this.documentQueryComponent.documentConditionalQueryForm.value as Dictionary<string>)[key]);
        }
      }

      documentIds = this.documentService.queryDocumentIds(
        isLatestFirst,
        pageSize,
        bookmark,
        ...formValues
      )
        .pipe(map((tableRecordData) => {
          this.bookmarks[this.paginator?.pageIndex! + 1] = tableRecordData.bookmark;
          return tableRecordData.ids;
        }));
    }

    return documentIds
      .pipe(map((documentIds) => {
        return documentIds.map(documentId => {
          return this.getTableItem(documentId, index++);
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
