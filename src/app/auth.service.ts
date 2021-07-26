import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Auth, Identity, RequestResult, RequestList, PendingRequestList } from './auth';

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

  getAuthRecord(): Observable<RequestList> {
    const recordUrl = `${this.url}/identity/auths/request-list`;
    const params = new HttpParams().set("isLatestFirst", "true").set("pageSize", "10");
    return this.http.get<RequestList>(recordUrl, { params }).pipe(
      catchError(this.handleError<RequestList>('getAuthRecord'))
    );
  }

  getPendingRecord(): Observable<PendingRequestList> {
    const recordUrl = `${this.url}/identity/auths/pending-list`;
    const params = new HttpParams().set("pageSize", "10");
    return this.http.get<PendingRequestList>(recordUrl, { params }).pipe(
      catchError(this.handleError<PendingRequestList>('getPendingRecord'))
    );
  }

  getAuthInfo(id: string): Observable<Auth> {
    const authUrl = `${this.url}/auth/${id}`;
    return this.http.get<Auth>(authUrl).pipe(
      catchError(this.handleError<Auth>('getAuthInfo'))
    );
  }

  setAuthResult(AuthSessionID: string, result: boolean): Observable<RequestResult> {
    let data = new FormData();
    data.append("AuthSessionID", AuthSessionID);
    data.append("result", String(result));
    const responseUrl = `${this.url}/auth/response`;
    return this.http.post<RequestResult>(responseUrl, data, this.httpOptions).pipe(
      tap(result => console.info('Set Auth Result:', result)),
      catchError(this.handleError<RequestResult>('setAuthResult'))
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
