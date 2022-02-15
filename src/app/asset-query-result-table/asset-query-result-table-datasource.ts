import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { forkJoin, merge, Observable, of as observableOf } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AssetQueryComponent } from '../asset-query/asset-query.component';
import { AssetService } from '../asset.service';
import { Utils } from '../utils';

// Data model type
export interface AssetQueryResultTableItem {
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
  designDocumentId: string;
}

/**
 * Data source for the AssetQueryResultTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AssetQueryResultTableDataSource extends DataSource<AssetQueryResultTableItem> {
  data: AssetQueryResultTableItem[] = [];
  bookmark: string = '';
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(private assetQueryComponent: AssetQueryComponent, private assetService: AssetService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<AssetQueryResultTableItem[]> {
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

  private getTableItem(assetId: string, index: number): Observable<AssetQueryResultTableItem> {
    return this.assetService.getAssetMetadataById(assetId)
      .pipe(map((assetMetadata) => {
        return {
          id: index,
          resourceId: assetMetadata.resourceId,
          resourceType: Utils.getResourceType('asset', assetMetadata.resourceType),
          name: assetMetadata.extensions.name,
          hash: assetMetadata.hash,
          ciphertextHash: assetMetadata.hashStored,
          size: assetMetadata.size,
          ciphertextSize: assetMetadata.sizeStored,
          creator: assetMetadata.creator,
          creationTime: Utils.formatDate(assetMetadata.timestamp),
          designDocumentId: assetMetadata.extensions.designDocumentId
        };
      }));
  }

  private getTableRecordData(isLatestFirst: boolean, pageSize: number, bookmark: string): Observable<AssetQueryResultTableItem[]> {
    let index = 1;
    let assetIds: Observable<string[]>;

    if (this.assetQueryComponent.currentQueryMethod === this.assetQueryComponent.queryMethods[0]) {
      // ID query
      // TODO: filter resourceType
      assetIds = observableOf([String(this.assetQueryComponent.assetIdQueryForm.get('resourceId')?.value)]);
    } else {
      // Conditional query
      let formValues = [];

      for (let key in this.assetQueryComponent.assetConditionalQueryForm.value) {
        if (key.startsWith('time')) { // time, timeAfterInclusive, timeBeforeExclusive
          formValues.push(this.assetQueryComponent.assetConditionalQueryForm.value[key]?.toJSON());
        } else {
          formValues.push(this.assetQueryComponent.assetConditionalQueryForm.value[key]);
        }
      }

      assetIds = this.assetService.queryAssetIds(
        isLatestFirst,
        pageSize,
        bookmark,
        ...formValues
      )
        .pipe(map((tableRecordData) => {
          this.bookmark = tableRecordData.bookmark;
          return tableRecordData.ids;
        }));
    }

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
