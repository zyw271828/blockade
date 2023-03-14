import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { forkJoin, merge, Observable, of as observableOf } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CitRecord } from '../cit-record';
import { DocumentService } from '../document.service';
import { Utils } from '../utils';

// Data model type
export interface DocumentUploadRecordTableItem {
  id: number;
  resourceId: string;
  resourceType: string;
  name: string;
  creationTime: string;
}

/**
 * Data source for the DocumentUploadRecordTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DocumentUploadRecordTableDataSource extends DataSource<DocumentUploadRecordTableItem> {
  data: DocumentUploadRecordTableItem[] = [];
  bookmarks: string[] = [''];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(private documentService: DocumentService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DocumentUploadRecordTableItem[]> {
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

  private getTableItem(documentId: string, index: number): Observable<DocumentUploadRecordTableItem> {
    return this.documentService.getDocumentMetadataById(documentId)
      .pipe(map((documentMetadata) => {
        let citRecord: CitRecord = Utils.getCitRecord(documentMetadata.extensions.name);

        return {
          id: index,
          resourceId: documentMetadata.resourceId,
          resourceType: Utils.getResourceType('document', documentMetadata.resourceType),
          name: citRecord.id,
          creationTime: Utils.formatDate(citRecord.date)
        };
      }));
  }

  private getTableRecordData(isLatestFirst: boolean, pageSize: number, bookmark: string): Observable<DocumentUploadRecordTableItem[]> {
    let index = 1;
    let documentIds: Observable<string[]>;

    documentIds = this.documentService.getDocumentUploadRecordIds(isLatestFirst, pageSize, bookmark)
      .pipe(map((tableRecordData) => {
        this.bookmarks[this.paginator?.pageIndex! + 1] = tableRecordData.bookmark;
        return tableRecordData.ids;
      }));

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
