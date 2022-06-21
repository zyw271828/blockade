import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { forkJoin, merge, Observable, of as observableOf } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AssetMetadata } from '../asset-metadata';
import { AuthService } from '../auth.service';
import { DocumentMetadata } from '../document-metadata';
import { ResourceService } from '../resource.service';
import { Utils } from '../utils';

// Data model type
export interface AuthRecordTableItem {
  id: number;
  resourceId: string;
  resourceType: string;
  name: string;
  authSessionId: string;
  status: string;
  hash: string;
  ciphertextHash: string;
  size: number;
  ciphertextSize: number;
  creator: string;
  creationTime: string;
  dataType: string;
  documentType: string;
  precedingDocumentId: string;
  headDocumentId: string;
  entityAssetId: string;
  designDocumentId: string;
}

/**
 * Data source for the AuthRecordTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AuthRecordTableDataSource extends DataSource<AuthRecordTableItem> {
  data: AuthRecordTableItem[] = [];
  bookmarks: string[] = [''];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(private authService: AuthService, private resourceService: ResourceService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<AuthRecordTableItem[]> {
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

  private getTableItem(authSessionId: string, index: number): Observable<AuthRecordTableItem> {
    return this.authService.getAuthSessionById(authSessionId)
      .pipe(map((authSession) => {
        return this.resourceService.getResourceMetadataById(authSession.resourceId)
          .pipe(map((resourceMetadata) => {
            return {
              id: index,
              resourceId: authSession.resourceId,
              resourceType: Utils.getResourceType(
                (resourceMetadata.extensions.dataType === 'Document') ? 'document' : 'asset',
                resourceMetadata.resourceType
              ),
              name: resourceMetadata.extensions.name,
              authSessionId: authSession.authSessionId,
              status: Utils.getAuthSessionStatus(authSession.status),
              hash: resourceMetadata.hash,
              ciphertextHash: resourceMetadata.hashStored,
              size: resourceMetadata.size,
              ciphertextSize: resourceMetadata.sizeStored,
              creator: resourceMetadata.creator,
              creationTime: Utils.formatDate(resourceMetadata.timestamp),
              dataType: resourceMetadata.extensions.dataType,
              documentType: Utils.getDocumentType((resourceMetadata as DocumentMetadata).extensions.documentType),
              precedingDocumentId: (resourceMetadata as DocumentMetadata).extensions.precedingDocumentId,
              headDocumentId: (resourceMetadata as DocumentMetadata).extensions.headDocumentId,
              entityAssetId: (resourceMetadata as DocumentMetadata).extensions.entityAssetId,
              designDocumentId: (resourceMetadata as AssetMetadata).extensions.designDocumentId
            };
          }));
      }))
      .pipe(
        mergeMap(result => result)
      );
  }

  private getTableRecordData(isLatestFirst: boolean, pageSize: number, bookmark: string): Observable<AuthRecordTableItem[]> {
    let index = 1;
    let authSessionIds: Observable<string[]>;

    authSessionIds = this.authService.getAuthSessionRecordIds(isLatestFirst, pageSize, bookmark)
      .pipe(map((tableRecordData) => {
        this.bookmarks[this.paginator?.pageIndex! + 1] = tableRecordData.bookmark;
        return tableRecordData.ids;
      }));

    return authSessionIds
      .pipe(map((authSessionIds) => {
        return authSessionIds.map(authSessionId => {
          return this.getTableItem(authSessionId, index++);
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
