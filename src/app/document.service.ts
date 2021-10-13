import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Document } from './document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private documentUrl = environment.apiEndpoint + '/document';

  constructor(private http: HttpClient) { }

  uploadDocument(document: Document): Observable<Document> {
    return this.http.post<Document>(this.documentUrl, document)
      .pipe(
        tap(_ => console.log('uploadDocument')),
        catchError(this.handleError<Document>('uploadDocument'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
