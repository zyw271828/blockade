import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Asset } from './asset';
import { AssetMetadata } from './asset-metadata';
import { AssetUpload } from './asset-upload';
import { NotificationComponent } from './notification/notification.component';
import { ResourceCreationInfo } from './resource-creation-info';
import { TableRecordData } from './table-record-data';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private assetUrl = environment.apiEndpoint + '/asset';
  private assetQueryUrl = environment.apiEndpoint + '/assets/list';
  private assetUploadRecordUrl = environment.apiEndpoint + '/identity/assets/list';

  constructor(private http: HttpClient, private notificationComponent: NotificationComponent) { }

  uploadAsset(asset: AssetUpload): Observable<ResourceCreationInfo> {
    let formData = new FormData();

    (Object.keys(asset) as Array<keyof typeof asset>).map(name => {
      let value: any = asset[name];

      formData.set(name, value);
    });

    return this.http.post<ResourceCreationInfo>(this.assetUrl, formData)
      .pipe(
        tap(_ => console.log('uploadAsset')),
        catchError(this.handleError<ResourceCreationInfo>('uploadAsset'))
      );
  }

  getAssetById(id: string, resourceType: string, keySwitchSessionId?: string, numSharesExpected?: string): Observable<Asset> {
    let params = new HttpParams().set('resourceType', resourceType);
    let logMsg = 'getAssetById' + '\nresourceType: ' + resourceType;

    if (keySwitchSessionId) {
      params = params.set('keySwitchSessionId', keySwitchSessionId);
      logMsg += '\nkeySwitchSessionId: ' + keySwitchSessionId;
    }

    // Temporarily set numSharesExpected to '2'
    numSharesExpected = '2';

    if (numSharesExpected) {
      params = params.set('numSharesExpected', numSharesExpected);
      logMsg += '\nnumSharesExpected: ' + numSharesExpected;
    }

    return this.http.get<Asset>(this.assetUrl + '/' + id, { params: params })
      .pipe(
        tap(_ => console.log(logMsg)),
        catchError(this.handleError<Asset>('getAssetById', <Asset>{}))
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

    if (resourceId) {
      params = params.append('resourceId', resourceId);
      logMsg += '\nresourceId: ' + resourceId;
    }
    if (name) {
      params = params.append('name', name);
      logMsg += '\nname: ' + name;
    }
    if (isNameExact) {
      params = params.append('isNameExact', isNameExact);
      logMsg += '\nisNameExact: ' + isNameExact;
    }
    if (time) {
      params = params.append('time', time);
      logMsg += '\ntime: ' + time;
    }
    if (timeAfterInclusive) {
      params = params.append('timeAfterInclusive', timeAfterInclusive);
      logMsg += '\ntimeAfterInclusive: ' + timeAfterInclusive;
    }
    if (timeBeforeExclusive) {
      params = params.append('timeBeforeExclusive', timeBeforeExclusive);
      logMsg += '\ntimeBeforeExclusive: ' + timeBeforeExclusive;
    }
    if (isTimeExact) {
      params = params.append('isTimeExact', isTimeExact);
      logMsg += '\nisTimeExact: ' + isTimeExact;
    }
    if (designDocumentId) {
      params = params.append('designDocumentId', designDocumentId);
      logMsg += '\ndesignDocumentId: ' + designDocumentId;
    }

    return this.http.get<TableRecordData>(this.assetQueryUrl, { params: params })
      .pipe(
        tap(_ => console.log(logMsg)),
        catchError(this.handleError<TableRecordData>('queryAssetIds'))
      );
  }

  getAssetMetadataById(id: string): Observable<AssetMetadata> {
    return this.http.get<AssetMetadata>(this.assetUrl + '/' + id + '/metadata')
      .pipe(
        tap(_ => console.log('getAssetMetadataById')),
        catchError(this.handleError<AssetMetadata>('getAssetMetadataById'))
      );
  }

  getAssetUploadRecordIds(isLatestFirst = true, pageSize = 10, bookmark = ''): Observable<TableRecordData> {
    return this.http.get<TableRecordData>(this.assetUploadRecordUrl, {
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
      if (error.error) {
        console.error(`${operation} failed: ${error.message}\n${error.error}`);
        this.notificationComponent.showError(`${error.status} ${error.statusText}: ${error.error}`);
      } else {
        console.error(`${operation} failed: ${error.message}`);
        this.notificationComponent.showError(`${error.status} ${error.statusText}`);
      }

      return of(result as T);
    };
  }
}
