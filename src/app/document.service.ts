import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Document } from './document';
import { ResourceCreationInfo } from './resource-creation-info';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private documentUrl = environment.apiEndpoint + '/document';

  constructor(private http: HttpClient) { }

  uploadDocument(document: Document): Observable<ResourceCreationInfo> {
    return this.http.post<ResourceCreationInfo>(this.documentUrl, document)
      .pipe(
        tap(_ => console.log('uploadDocument')),
        catchError(this.handleError<ResourceCreationInfo>('uploadDocument'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
