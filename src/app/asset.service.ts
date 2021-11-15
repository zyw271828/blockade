import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Asset } from './asset';
import { AssetMetadata } from './asset-metadata';
import { ResourceCreationInfo } from './resource-creation-info';
import { TableRecordData } from './table-record-data';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private assetUrl = environment.apiEndpoint + '/asset';
  private assetUploadRecordUrl = environment.apiEndpoint + '/identity/assets/list';

  constructor(private http: HttpClient) { }

  uploadAsset(asset: Asset): Observable<ResourceCreationInfo> {
    return this.http.post<ResourceCreationInfo>(this.assetUrl, asset)
      .pipe(
        tap(_ => console.log('uploadAsset')),
        catchError(this.handleError<ResourceCreationInfo>('uploadAsset'))
      );
  }

  getAssetMetadataById(id: string): Observable<AssetMetadata> {
    return this.http.get<AssetMetadata>(this.assetUrl + '/' + id + '/metadata')
      .pipe(
        tap(_ => console.log('getAssetMetadataById')),
        catchError(this.handleError<AssetMetadata>('getAssetMetadataById'))
      );
  }

  getAssetUploadRecordIDs(isLatestFirst = true, pageSize = 10, bookmark = ''): Observable<TableRecordData> {
    return this.http.get<TableRecordData>(this.assetUploadRecordUrl, {
      params: new HttpParams()
        .set('isLatestFirst', isLatestFirst)
        .set('pageSize', pageSize)
        .set('bookmark', bookmark)
    })
      .pipe(
        tap(_ => console.log('getAssetUploadRecordIDs'
          + '\nisLatestFirst: ' + isLatestFirst
          + '\npageSize: ' + pageSize
          + '\nbookmark: ' + bookmark)),
        catchError(this.handleError<TableRecordData>('getAssetUploadRecordIDs'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
