import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Identity, RequestResult } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:1080';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
  };

  constructor(private http: HttpClient) { }

  checkConnection(): Observable<any> {
    const pingUrl = `${this.url}/ping`;
    return this.http.get(pingUrl, { observe: 'response' }).pipe(
      tap(response => console.info("Connection status: ", response.status)),
      catchError(this.handleError('ping'))
    );
  }

  requestIdentity(): Observable<Identity> {
    const identityUrl = `${this.url}/identity`;
    return this.http.get<Identity>(identityUrl).pipe(
      tap(_ => console.info('Get identity information.')),
      catchError(this.handleError<Identity>('identity'))
    );
  }

  requestAuth(auth: FormData): Observable<RequestResult> {
    const authUrl = `${this.url}/auth/request`;
    return this.http.post<RequestResult>(authUrl, auth, this.httpOptions).pipe(
      tap(result => console.info('Request Auth Result:', result)),
      catchError(this.handleError<RequestResult>('requestAuth'))
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
