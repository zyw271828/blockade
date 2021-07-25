import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Document, UploadResult } from './document';

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
