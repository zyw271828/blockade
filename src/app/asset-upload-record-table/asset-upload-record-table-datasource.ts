import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { forkJoin, merge, Observable, of as observableOf } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AssetService } from '../asset.service';
import { Utils } from '../utils';

// Data model type
export interface AssetUploadRecordTableItem {
  id: number;
  resourceID: string;
  resourceType: string;
  name: string;
  creationTime: string;
}

/**
 * Data source for the AssetUploadRecordTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AssetUploadRecordTableDataSource extends DataSource<AssetUploadRecordTableItem> {
  data: AssetUploadRecordTableItem[] = [];
  bookmark: string = '';
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(private assetService: AssetService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<AssetUploadRecordTableItem[]> {
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

  private getTableItem(assetID: string, index: number): Observable<AssetUploadRecordTableItem> {
    return this.assetService.getAssetMetadataById(assetID)
      .pipe(map((assetMetadata) => {
        return {
          id: index,
          resourceID: assetMetadata.resourceID,
          resourceType: Utils.getResourceTypes('asset')[assetMetadata.resourceType],
          name: assetMetadata.extensions.name,
          creationTime: Utils.formatDate(assetMetadata.timestamp)
        };
      }));
  }

  private getTableRecordData(isLatestFirst: boolean, pageSize: number, bookmark: string): Observable<AssetUploadRecordTableItem[]> {
    let index = 1;
    let assetIDs: Observable<string[]>;

    assetIDs = this.assetService.getAssetUploadRecordIDs(isLatestFirst, pageSize, bookmark)
      .pipe(map((tableRecordData) => {
        this.bookmark = tableRecordData.bookmark;
        return tableRecordData.IDs;
      }));

    return assetIDs
      .pipe(map((assetIDs) => {
        return assetIDs.map(assetID => {
          return this.getTableItem(assetID, index++);
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
