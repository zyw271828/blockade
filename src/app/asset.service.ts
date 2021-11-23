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
  private assetQueryUrl = environment.apiEndpoint + '/assets/list';
  private assetUploadRecordUrl = environment.apiEndpoint + '/identity/assets/list';

  constructor(private http: HttpClient) { }

  uploadAsset(asset: Asset): Observable<ResourceCreationInfo> {
    return this.http.post<ResourceCreationInfo>(this.assetUrl, asset)
      .pipe(
        tap(_ => console.log('uploadAsset')),
        catchError(this.handleError<ResourceCreationInfo>('uploadAsset'))
      );
  }

  queryAssetIDs(
    isLatestFirst = true,
    pageSize = 10,
    bookmark = '',
    resourceID?: string,
    name?: string,
    isNameExact?: boolean,
    time?: string,
    timeAfterInclusive?: string,
    timeBeforeExclusive?: string,
    isTimeExact?: boolean,
    designDocumentID?: string
  ): Observable<TableRecordData> {
    let params = new HttpParams()
      .set('isLatestFirst', isLatestFirst)
      .set('pageSize', pageSize)
      .set('bookmark', bookmark);
    let logMsg = 'queryAssetIDs'
      + '\nisLatestFirst: ' + isLatestFirst
      + '\npageSize: ' + pageSize
      + '\nbookmark: ' + bookmark;

    if (resourceID !== undefined) {
      params = params.append('resourceID', resourceID);
      logMsg += '\nresourceID: ' + resourceID;
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
    if (designDocumentID !== undefined) {
      params = params.append('designDocumentID', designDocumentID);
      logMsg += '\ndesignDocumentID: ' + designDocumentID;
    }

    return this.http.get<TableRecordData>(this.assetQueryUrl, { params: params })
      .pipe(
        tap(_ => console.log(logMsg)),
        catchError(this.handleError<TableRecordData>('queryAssetIDs'))
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
