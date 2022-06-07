import { HttpClient, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Document } from './document';
import { DocumentMetadata } from './document-metadata';
import { DocumentProperties } from './document-properties';
import { DocumentUpload } from './document-upload';
import { NotificationComponent } from './notification/notification.component';
import { ResourceCreationInfo } from './resource-creation-info';
import { TableRecordData } from './table-record-data';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private documentUrl = environment.apiEndpoint + '/document';
  private documentQueryUrl = environment.apiEndpoint + '/documents/list';
  private documentUploadRecordUrl = environment.apiEndpoint + '/identity/documents/list';

  constructor(private http: HttpClient, private notificationComponent: NotificationComponent) { }

  uploadDocument(document: DocumentUpload, filename: string): Observable<ResourceCreationInfo> {
    let formData = new FormData();

    (Object.keys(document) as Array<keyof typeof document>).map(name => {
      if (typeof document[name] === typeof true) {
        formData.set(name, String(document[name]));
      } else if (name === 'contents') {
        formData.set(name, new Blob([document[name]]), filename);
      } else {
        let value: any = document[name];

        formData.set(name, value);
      }
    });

    return this.http.post<ResourceCreationInfo>(this.documentUrl, formData)
      .pipe(
        tap(_ => console.log('uploadDocument')),
        catchError(this.handleError<ResourceCreationInfo>('uploadDocument'))
      );
  }

  getDocumentById(id: string, resourceType: string, keySwitchSessionId?: string, numSharesExpected?: string): Observable<Document> {
    let params = new HttpParams().set('resourceType', resourceType);
    let logMsg = 'getDocumentById' + '\nresourceType: ' + resourceType;

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

    return this.http.get<Document>(this.documentUrl + '/' + id, { params: params })
      .pipe(
        tap(_ => console.log(logMsg)),
        catchError(this.handleError<Document>('getDocumentById', <Document>{}))
      );
  }

  queryDocumentIds(
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
    documentType?: string,
    precedingDocumentId?: string,
    headDocumentId?: string,
    entityAssetId?: string
  ): Observable<TableRecordData> {
    let params = new HttpParams()
      .set('isLatestFirst', isLatestFirst)
      .set('pageSize', pageSize)
      .set('bookmark', bookmark);
    let logMsg = 'queryDocumentIds'
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
    if (documentType) {
      params = params.append('documentType', documentType);
      logMsg += '\ndocumentType: ' + documentType;
    }
    if (precedingDocumentId) {
      params = params.append('precedingDocumentId', precedingDocumentId);
      logMsg += '\nprecedingDocumentId: ' + precedingDocumentId;
    }
    if (headDocumentId) {
      params = params.append('headDocumentId', headDocumentId);
      logMsg += '\nheadDocumentId: ' + headDocumentId;
    }
    if (entityAssetId) {
      params = params.append('entityAssetId', entityAssetId);
      logMsg += '\nentityAssetId: ' + entityAssetId;
    }

    return this.http.get<TableRecordData>(this.documentQueryUrl, { params: params })
      .pipe(
        tap(_ => console.log(logMsg)),
        catchError(this.handleError<TableRecordData>('queryDocumentIds'))
      );
  }

  getDocumentMetadataById(id: string): Observable<DocumentMetadata> {
    return this.http.get<DocumentMetadata>(this.documentUrl + '/' + id + '/metadata')
      .pipe(
        tap(_ => console.log('getDocumentMetadataById')),
        catchError(this.handleError<DocumentMetadata>('getDocumentMetadataById'))
      );
  }

  checkDocumentIdValidity(id: string): Observable<boolean> {
    return this.http.get(this.documentUrl + '/' + id + '/metadata', { observe: 'response' })
      .pipe(
        map(response => {
          console.log('checkDocumentIdValidity: ' + response.status);
          return response.status === HttpStatusCode.Ok;
        }),
        catchError(this.handleError<boolean>('checkDocumentIdValidity', false))
      );
  }

  getDocumentPropertiesById(id: string, keySwitchSessionId?: string, numSharesExpected?: string): Observable<DocumentProperties> {
    let params = new HttpParams();
    let logMsg = 'getDocumentPropertiesById';

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

    return this.http.get<DocumentProperties>(this.documentUrl + '/' + id + '/properties', { params: params })
      .pipe(
        tap(_ => console.log(logMsg)),
        catchError(this.handleError<DocumentProperties>('getDocumentPropertiesById'))
      );
  }

  getDocumentUploadRecordIds(isLatestFirst = true, pageSize = 10, bookmark = ''): Observable<TableRecordData> {
    return this.http.get<TableRecordData>(this.documentUploadRecordUrl, {
      params: new HttpParams()
        .set('isLatestFirst', isLatestFirst)
        .set('pageSize', pageSize)
        .set('bookmark', bookmark)
    })
      .pipe(
        tap(_ => console.log('getDocumentUploadRecordIds'
          + '\nisLatestFirst: ' + isLatestFirst
          + '\npageSize: ' + pageSize
          + '\nbookmark: ' + bookmark)),
        catchError(this.handleError<TableRecordData>('getDocumentUploadRecordIds'))
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
