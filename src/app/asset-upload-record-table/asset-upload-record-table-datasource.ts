import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { forkJoin, merge, Observable, of as observableOf } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AssetService } from '../asset.service';
import { Tce3Record } from '../tce3-record';
import { Utils } from '../utils';

// Data model type
export interface AssetUploadRecordTableItem {
  id: number;
  resourceId: string;
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
  bookmarks: string[] = [''];
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

  private getTableItem(assetId: string, index: number): Observable<AssetUploadRecordTableItem> {
    return this.assetService.getAssetMetadataById(assetId)
      .pipe(map((assetMetadata) => {
        let json = JSON.parse(assetMetadata.extensions.name);
        let uuidIndex = assetMetadata.extensions.name.indexOf('uuid');
        let tce3Record: Tce3Record = {
          uuid: assetMetadata.extensions.name.substring(uuidIndex + 7, uuidIndex + 7 + 36),
          datum: JSON.stringify(json.datum),
          cdmVersion: json.CDMVersion,
          source: json.source
        };

        return {
          id: index,
          resourceId: assetMetadata.resourceId,
          resourceType: Utils.getResourceType('asset', assetMetadata.resourceType),
          name: tce3Record.uuid,
          creationTime: Utils.formatDate(assetMetadata.timestamp)
        };
      }));
  }

  private getTableRecordData(isLatestFirst: boolean, pageSize: number, bookmark: string): Observable<AssetUploadRecordTableItem[]> {
    let index = 1;
    let assetIds: Observable<string[]>;

    assetIds = this.assetService.getAssetUploadRecordIds(isLatestFirst, pageSize, bookmark)
      .pipe(map((tableRecordData) => {
        this.bookmarks[this.paginator?.pageIndex! + 1] = tableRecordData.bookmark;
        return tableRecordData.ids;
      }));

    return assetIds
      .pipe(map((assetIds) => {
        return assetIds.map(assetId => {
          return this.getTableItem(assetId, index++);
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
