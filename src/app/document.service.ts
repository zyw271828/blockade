import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Document } from './document';
import { DocumentMetadata } from './document-metadata';
import { DocumentProperties } from './document-properties';
import { DocumentUpload } from './document-upload';
import { ResourceCreationInfo } from './resource-creation-info';
import { TableRecordData } from './table-record-data';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private documentUrl = environment.apiEndpoint + '/document';
  private documentQueryUrl = environment.apiEndpoint + '/documents/list';
  private documentUploadRecordUrl = environment.apiEndpoint + '/identity/documents/list';

  constructor(private http: HttpClient) { }

  uploadDocument(document: DocumentUpload): Observable<ResourceCreationInfo> {
    return this.http.post<ResourceCreationInfo>(this.documentUrl, document)
      .pipe(
        tap(_ => console.log('uploadDocument')),
        catchError(this.handleError<ResourceCreationInfo>('uploadDocument'))
      );
  }

  getDocumentById(id: string, resourceType: string, keySwitchSessionID?: string): Observable<Document> {
    let params = new HttpParams().set('resourceType', resourceType);
    let logMsg = 'getDocumentById' + '\nresourceType: ' + resourceType;

    if (keySwitchSessionID !== undefined) {
      params = params.set('keySwitchSessionID', keySwitchSessionID);
      logMsg += '\nkeySwitchSessionID: ' + keySwitchSessionID;
    }

    return this.http.get<Document>(this.documentUrl + '/' + id, { params: params })
      .pipe(
        tap(_ => console.log(logMsg)),
        catchError(this.handleError<Document>('getDocumentById'))
      );
  }

  queryDocumentIDs(
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
    documentType?: string,
    precedingDocumentID?: string,
    headDocumentID?: string,
    entityAssetID?: string
  ): Observable<TableRecordData> {
    let params = new HttpParams()
      .set('isLatestFirst', isLatestFirst)
      .set('pageSize', pageSize)
      .set('bookmark', bookmark);
    let logMsg = 'queryDocumentIDs'
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
    if (documentType !== undefined) {
      params = params.append('documentType', documentType);
      logMsg += '\ndocumentType: ' + documentType;
    }
    if (precedingDocumentID !== undefined) {
      params = params.append('precedingDocumentID', precedingDocumentID);
      logMsg += '\nprecedingDocumentID: ' + precedingDocumentID;
    }
    if (headDocumentID !== undefined) {
      params = params.append('headDocumentID', headDocumentID);
      logMsg += '\nheadDocumentID: ' + headDocumentID;
    }
    if (entityAssetID !== undefined) {
      params = params.append('entityAssetID', entityAssetID);
      logMsg += '\nentityAssetID: ' + entityAssetID;
    }

    return this.http.get<TableRecordData>(this.documentQueryUrl, { params: params })
      .pipe(
        tap(_ => console.log(logMsg)),
        catchError(this.handleError<TableRecordData>('queryDocumentIDs'))
      );
  }

  getDocumentMetadataById(id: string): Observable<DocumentMetadata> {
    return this.http.get<DocumentMetadata>(this.documentUrl + '/' + id + '/metadata')
      .pipe(
        tap(_ => console.log('getDocumentMetadataById')),
        catchError(this.handleError<DocumentMetadata>('getDocumentMetadataById'))
      );
  }

  getDocumentPropertiesById(id: string, keySwitchSessionID: string): Observable<DocumentProperties> {
    let params = new HttpParams().set('keySwitchSessionID', keySwitchSessionID);

    return this.http.get<DocumentProperties>(this.documentUrl + '/' + id + '/properties', { params: params })
      .pipe(
        tap(_ => console.log('getDocumentPropertiesById' + '\nkeySwitchSessionID: ' + keySwitchSessionID)),
        catchError(this.handleError<DocumentProperties>('getDocumentPropertiesById'))
      );
  }

  getDocumentUploadRecordIDs(isLatestFirst = true, pageSize = 10, bookmark = ''): Observable<TableRecordData> {
    return this.http.get<TableRecordData>(this.documentUploadRecordUrl, {
      params: new HttpParams()
        .set('isLatestFirst', isLatestFirst)
        .set('pageSize', pageSize)
        .set('bookmark', bookmark)
    })
      .pipe(
        tap(_ => console.log('getDocumentUploadRecordIDs'
          + '\nisLatestFirst: ' + isLatestFirst
          + '\npageSize: ' + pageSize
          + '\nbookmark: ' + bookmark)),
        catchError(this.handleError<TableRecordData>('getDocumentUploadRecordIDs'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
