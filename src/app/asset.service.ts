import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Asset } from './asset';
import { AssetMetadata } from './asset-metadata';
import { AssetUpload } from './asset-upload';
import { ResourceCreationInfo } from './resource-creation-info';
import { TableRecordData } from './table-record-data';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private assetUrl = (): string => { return environment.apiEndpoint + '/asset' };
  private assetQueryUrl = (): string => { return environment.apiEndpoint + '/assets/list' };
  private assetUploadRecordUrl = (): string => { return environment.apiEndpoint + '/identity/assets/list' };

  constructor(private http: HttpClient) { }

  uploadAsset(asset: AssetUpload): Observable<ResourceCreationInfo> {
    return this.http.post<ResourceCreationInfo>(this.assetUrl(), asset)
      .pipe(
        tap(_ => console.log('uploadAsset')),
        catchError(this.handleError<ResourceCreationInfo>('uploadAsset'))
      );
  }

  getAssetById(id: string, resourceType: string, keySwitchSessionId?: string): Observable<Asset> {
    let params = new HttpParams().set('resourceType', resourceType);
    let logMsg = 'getAssetById' + '\nresourceType: ' + resourceType;

    if (keySwitchSessionId !== undefined) {
      params = params.set('keySwitchSessionId', keySwitchSessionId);
      logMsg += '\nkeySwitchSessionId: ' + keySwitchSessionId;
    }

    return this.http.get<Asset>(this.assetUrl() + '/' + id, { params: params })
      .pipe(
        tap(_ => console.log(logMsg)),
        catchError(this.handleError<Asset>('getAssetById'))
      );
  }

  queryAssetIds(
    isLatestFirst = true,
    pageSize = 10,
    bookmark = '',
    resourceId?: string,
    name?: string,
    isNameExact?: boolean,
    time?: string,
    timeAfterInclusive?: string,
    timeBeforeExclusive?: string,
    isTimeExact?: boolean,
    designDocumentId?: string
  ): Observable<TableRecordData> {
    let params = new HttpParams()
      .set('isLatestFirst', isLatestFirst)
      .set('pageSize', pageSize)
      .set('bookmark', bookmark);
    let logMsg = 'queryAssetIds'
      + '\nisLatestFirst: ' + isLatestFirst
      + '\npageSize: ' + pageSize
      + '\nbookmark: ' + bookmark;

    if (resourceId !== undefined) {
      params = params.append('resourceId', resourceId);
      logMsg += '\nresourceId: ' + resourceId;
    }
    if (name !== undefined) {
      params = params.append('name', name);
      logMsg += '\nname: ' + name;
    }
    if (isNameExact !== undefined) {
      params = params.append('isNameExact', isNameExact);
      logMsg += '\nisNameExact: ' + isNameExact;
    }
    if (time !== undefined) {
      params = params.append('time', time);
      logMsg += '\ntime: ' + time;
    }
    if (timeAfterInclusive !== undefined) {
      params = params.append('timeAfterInclusive', timeAfterInclusive);
      logMsg += '\ntimeAfterInclusive: ' + timeAfterInclusive;
    }
    if (timeBeforeExclusive !== undefined) {
      params = params.append('timeBeforeExclusive', timeBeforeExclusive);
      logMsg += '\ntimeBeforeExclusive: ' + timeBeforeExclusive;
    }
    if (isTimeExact !== undefined) {
      params = params.append('isTimeExact', isTimeExact);
      logMsg += '\nisTimeExact: ' + isTimeExact;
    }
    if (designDocumentId !== undefined) {
      params = params.append('designDocumentId', designDocumentId);
      logMsg += '\ndesignDocumentId: ' + designDocumentId;
    }

    return this.http.get<TableRecordData>(this.assetQueryUrl(), { params: params })
      .pipe(
        tap(_ => console.log(logMsg)),
        catchError(this.handleError<TableRecordData>('queryAssetIds'))
      );
  }

  getAssetMetadataById(id: string): Observable<AssetMetadata> {
    return this.http.get<AssetMetadata>(this.assetUrl() + '/' + id + '/metadata')
      .pipe(
        tap(_ => console.log('getAssetMetadataById')),
        catchError(this.handleError<AssetMetadata>('getAssetMetadataById'))
      );
  }

  getAssetUploadRecordIds(isLatestFirst = true, pageSize = 10, bookmark = ''): Observable<TableRecordData> {
    return this.http.get<TableRecordData>(this.assetUploadRecordUrl(), {
      params: new HttpParams()
        .set('isLatestFirst', isLatestFirst)
        .set('pageSize', pageSize)
        .set('bookmark', bookmark)
    })
      .pipe(
        tap(_ => console.log('getAssetUploadRecordIds'
          + '\nisLatestFirst: ' + isLatestFirst
          + '\npageSize: ' + pageSize
          + '\nbookmark: ' + bookmark)),
        catchError(this.handleError<TableRecordData>('getAssetUploadRecordIds'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
