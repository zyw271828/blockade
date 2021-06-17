import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

// Data model type
export interface AuthRecordTableItem {
  id: number;
  resourceID: number;
  resourceType: string;
  name: string;
  authSessionID: string;
  status: string;
}

// TODO: replace this with real data
const EXAMPLE_DATA: AuthRecordTableItem[] = [
  { id: 1, resourceID: 20, resourceType: 'Plaintext', name: 'name', authSessionID: 'ABCDEF', status: 'Allow' },
  { id: 2, resourceID: 19, resourceType: 'Encryption (on chain)', name: 'name', authSessionID: 'ABCDEF', status: 'Deny' },
  { id: 3, resourceID: 18, resourceType: 'Encryption (off chain)', name: 'name', authSessionID: 'ABCDEF', status: 'Unknown' },
  { id: 4, resourceID: 17, resourceType: 'Plaintext', name: 'name', authSessionID: 'ABCDEF', status: 'Allow' },
  { id: 5, resourceID: 16, resourceType: 'Encryption (on chain)', name: 'name', authSessionID: 'ABCDEF', status: 'Deny' },
  { id: 6, resourceID: 15, resourceType: 'Encryption (off chain)', name: 'name', authSessionID: 'ABCDEF', status: 'Unknown' },
  { id: 7, resourceID: 14, resourceType: 'Plaintext', name: 'name', authSessionID: 'ABCDEF', status: 'Allow' },
  { id: 8, resourceID: 13, resourceType: 'Encryption (on chain)', name: 'name', authSessionID: 'ABCDEF', status: 'Deny' },
  { id: 9, resourceID: 12, resourceType: 'Encryption (off chain)', name: 'name', authSessionID: 'ABCDEF', status: 'Unknown' },
  { id: 10, resourceID: 11, resourceType: 'Plaintext', name: 'name', authSessionID: 'ABCDEF', status: 'Allow' },
  { id: 11, resourceID: 10, resourceType: 'Encryption (on chain)', name: 'name', authSessionID: 'ABCDEF', status: 'Deny' },
  { id: 12, resourceID: 9, resourceType: 'Encryption (off chain)', name: 'name', authSessionID: 'ABCDEF', status: 'Unknown' },
  { id: 13, resourceID: 8, resourceType: 'Plaintext', name: 'name', authSessionID: 'ABCDEF', status: 'Allow' },
  { id: 14, resourceID: 7, resourceType: 'Encryption (on chain)', name: 'name', authSessionID: 'ABCDEF', status: 'Deny' },
  { id: 15, resourceID: 6, resourceType: 'Encryption (off chain)', name: 'name', authSessionID: 'ABCDEF', status: 'Unknown' },
  { id: 16, resourceID: 5, resourceType: 'Plaintext', name: 'name', authSessionID: 'ABCDEF', status: 'Allow' },
  { id: 17, resourceID: 4, resourceType: 'Encryption (on chain)', name: 'name', authSessionID: 'ABCDEF', status: 'Deny' },
  { id: 18, resourceID: 3, resourceType: 'Encryption (off chain)', name: 'name', authSessionID: 'ABCDEF', status: 'Unknown' },
  { id: 19, resourceID: 2, resourceType: 'Plaintext', name: 'name', authSessionID: 'ABCDEF', status: 'Allow' },
  { id: 20, resourceID: 1, resourceType: 'Encryption (on chain)', name: 'name', authSessionID: 'ABCDEF', status: 'Deny' },
];

/**
 * Data source for the AuthRecordTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AuthRecordTableDataSource extends DataSource<AuthRecordTableItem> {
  data: AuthRecordTableItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
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
          return this.getPagedData(this.getSortedData([...this.data]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void { }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: AuthRecordTableItem[]): AuthRecordTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: AuthRecordTableItem[]): AuthRecordTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'resourceID': return compare(+a.resourceID, +b.resourceID, isAsc);
        case 'resourceType': return compare(a.resourceType, b.resourceType, isAsc);
        case 'name': return compare(a.name, b.name, isAsc);
        case 'authSessionID': return compare(a.authSessionID, b.authSessionID, isAsc);
        case 'status': return compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
