import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

// Data model type
export interface AssetUploadRecordTableItem {
  id: number;
  resourceID: number;
  resourceType: string;
  name: string;
  creationTime: Date;
}

// TODO: replace this with real data
const EXAMPLE_DATA: AssetUploadRecordTableItem[] = [
  { id: 1, resourceID: 20, resourceType: 'Plaintext', name: 'name', creationTime: new Date() },
  { id: 2, resourceID: 19, resourceType: 'Encryption', name: 'name', creationTime: new Date() },
  { id: 3, resourceID: 18, resourceType: 'Encryption', name: 'name', creationTime: new Date() },
  { id: 4, resourceID: 17, resourceType: 'Plaintext', name: 'name', creationTime: new Date() },
  { id: 5, resourceID: 16, resourceType: 'Encryption', name: 'name', creationTime: new Date() },
  { id: 6, resourceID: 15, resourceType: 'Encryption', name: 'name', creationTime: new Date() },
  { id: 7, resourceID: 14, resourceType: 'Plaintext', name: 'name', creationTime: new Date() },
  { id: 8, resourceID: 13, resourceType: 'Encryption', name: 'name', creationTime: new Date() },
  { id: 9, resourceID: 12, resourceType: 'Encryption', name: 'name', creationTime: new Date() },
  { id: 10, resourceID: 11, resourceType: 'Plaintext', name: 'name', creationTime: new Date() },
  { id: 11, resourceID: 10, resourceType: 'Encryption', name: 'name', creationTime: new Date() },
  { id: 12, resourceID: 9, resourceType: 'Encryption', name: 'name', creationTime: new Date() },
  { id: 13, resourceID: 8, resourceType: 'Plaintext', name: 'name', creationTime: new Date() },
  { id: 14, resourceID: 7, resourceType: 'Encryption', name: 'name', creationTime: new Date() },
  { id: 15, resourceID: 6, resourceType: 'Encryption', name: 'name', creationTime: new Date() },
  { id: 16, resourceID: 5, resourceType: 'Plaintext', name: 'name', creationTime: new Date() },
  { id: 17, resourceID: 4, resourceType: 'Encryption', name: 'name', creationTime: new Date() },
  { id: 18, resourceID: 3, resourceType: 'Encryption', name: 'name', creationTime: new Date() },
  { id: 19, resourceID: 2, resourceType: 'Plaintext', name: 'name', creationTime: new Date() },
  { id: 20, resourceID: 1, resourceType: 'Encryption', name: 'name', creationTime: new Date() },
];

/**
 * Data source for the AssetUploadRecordTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AssetUploadRecordTableDataSource extends DataSource<AssetUploadRecordTableItem> {
  data: AssetUploadRecordTableItem[] = EXAMPLE_DATA;
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
  connect(): Observable<AssetUploadRecordTableItem[]> {
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
  private getPagedData(data: AssetUploadRecordTableItem[]): AssetUploadRecordTableItem[] {
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
  private getSortedData(data: AssetUploadRecordTableItem[]): AssetUploadRecordTableItem[] {
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
        case 'creationTime': return compare(a.creationTime, b.creationTime, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example columns (for client-side sorting). */
function compare(a: string | number | Date, b: string | number | Date, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
