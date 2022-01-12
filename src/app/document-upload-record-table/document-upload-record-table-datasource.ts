import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { forkJoin, merge, Observable, of as observableOf } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DocumentService } from '../document.service';
import { Utils } from '../utils';

// Data model type
export interface DocumentUploadRecordTableItem {
  id: number;
  resourceID: string;
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
  bookmark: string = '';
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

  private getTableItem(documentID: string, index: number): Observable<DocumentUploadRecordTableItem> {
    return this.documentService.getDocumentMetadataById(documentID)
      .pipe(map((documentMetadata) => {
        return {
          id: index,
          resourceID: documentMetadata.resourceID,
          resourceType: Utils.getResourceType('document', documentMetadata.resourceType),
          name: documentMetadata.extensions.name,
          creationTime: Utils.formatDate(documentMetadata.timestamp)
        };
      }));
  }

  private getTableRecordData(isLatestFirst: boolean, pageSize: number, bookmark: string): Observable<DocumentUploadRecordTableItem[]> {
    let index = 1;
    let documentIDs: Observable<string[]>;

    documentIDs = this.documentService.getDocumentUploadRecordIDs(isLatestFirst, pageSize, bookmark)
      .pipe(map((tableRecordData) => {
        this.bookmark = tableRecordData.bookmark;
        return tableRecordData.IDs;
      }));

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
