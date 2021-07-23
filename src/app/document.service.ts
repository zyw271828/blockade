import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Document, UploadResult } from './document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private url = 'https://5879aec4-a9da-47c5-ab6d-885144e6f92e.mock.pstmn.io'

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  uploadDocument(document: Document): Observable<UploadResult> {
    const documentUrl = `${this.url}/document`;
    console.info('Document uploading', document);
    return this.http.post<UploadResult>(documentUrl, document, this.httpOptions).pipe(
      tap(result => console.info('Result received:', result)),
      catchError(this.handleError<UploadResult>('uploadDocument'))
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
