import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Document, UploadResult, QueryResult } from './document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private url = 'http://localhost:1080';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
  };

  constructor(private http: HttpClient) { }

  uploadDocument(document: FormData): Observable<UploadResult> {
    const documentUrl = `${this.url}/document`;
    return this.http.post<UploadResult>(documentUrl, document, this.httpOptions).pipe(
      tap(result => console.info('Upload Document Result:', result)),
      catchError(this.handleError<UploadResult>('uploadDocument'))
    );
  }

  getDocument(id: string): Observable<Document> {
    const documentUrl = `${this.url}/document`;
    return this.http.get<Document>(`${documentUrl}/${id}`).pipe(
      catchError(this.handleError<Document>('getDocument'))
    );
  }

  getUploadRecord(): Observable<QueryResult> {
    const recordUrl = `${this.url}/identity/documents/list`;
    const params = new HttpParams().set("isLatestFirst", "true").set("pageSize", "10");
    return this.http.get<QueryResult>(recordUrl, { params }).pipe(
      catchError(this.handleError<QueryResult>('getUploadRecord: Get list'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.warn(message);
  }
}
