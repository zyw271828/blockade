import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { forkJoin, merge, Observable, of as observableOf } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Utils } from '../utils';

// Data model type
export interface AuthRecordTableItem {
  id: number;
  resourceID: string;
  resourceType: string;
  name: string;
  authSessionID: string;
  status: string;
}

/**
 * Data source for the AuthRecordTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AuthRecordTableDataSource extends DataSource<AuthRecordTableItem> {
  data: AuthRecordTableItem[] = [];
  bookmark: string = '';
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<AuthRecordTableItem[]> {
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

  private getTableItem(authSessionID: string, index: number): Observable<AuthRecordTableItem> {
    return this.authService.getAuthSessionById(authSessionID)
      .pipe(map((authSession) => {
        return {
          id: index,
          resourceID: authSession.resourceID,
          resourceType: 'resourceType', // TODO: get resourceType
          name: 'name', // TODO: get name
          authSessionID: authSession.authSessionID,
          status: Utils.getAuthSessionStatus()[authSession.status]
        };
      }));
  }

  private getTableRecordData(isLatestFirst: boolean, pageSize: number, bookmark: string): Observable<AuthRecordTableItem[]> {
    let index = 1;
    let authSessionIDs: Observable<string[]>;

    authSessionIDs = this.authService.getAuthSessionIDs(isLatestFirst, pageSize, bookmark)
      .pipe(map((tableRecordData) => {
        this.bookmark = tableRecordData.bookmark;
        return tableRecordData.IDs;
      }));

    return authSessionIDs
      .pipe(map((authSessionIDs) => {
        return authSessionIDs.map(authSessionID => {
          return this.getTableItem(authSessionID, index++);
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
