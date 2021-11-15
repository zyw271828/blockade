import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Document } from './document';
import { DocumentMetadata } from './document-metadata';
import { ResourceCreationInfo } from './resource-creation-info';
import { TableRecordData } from './table-record-data';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private documentUrl = environment.apiEndpoint + '/document';
  private documentUploadRecordUrl = environment.apiEndpoint + '/identity/documents/list';

  constructor(private http: HttpClient) { }

  uploadDocument(document: Document): Observable<ResourceCreationInfo> {
    return this.http.post<ResourceCreationInfo>(this.documentUrl, document)
      .pipe(
        tap(_ => console.log('uploadDocument')),
        catchError(this.handleError<ResourceCreationInfo>('uploadDocument'))
      );
  }

  getDocumentMetadataById(id: string): Observable<DocumentMetadata> {
    return this.http.get<DocumentMetadata>(this.documentUrl + '/' + id + '/metadata')
      .pipe(
        tap(_ => console.log('getDocumentMetadataById')),
        catchError(this.handleError<DocumentMetadata>('getDocumentMetadataById'))
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
