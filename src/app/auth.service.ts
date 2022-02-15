import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthRequest } from './auth-request';
import { AuthResponse } from './auth-response';
import { AuthSession } from './auth-session';
import { ResourceCreationInfo } from './resource-creation-info';
import { TableRecordData } from './table-record-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = environment.apiEndpoint + '/auth';
  private authRequestUrl = environment.apiEndpoint + '/auth/request';
  private authResponseUrl = environment.apiEndpoint + '/auth/response';
  private authRecordUrl = environment.apiEndpoint + '/identity/auths/request-list';
  private authApproveUrl = environment.apiEndpoint + '/identity/auths/pending-list';

  constructor(private http: HttpClient) { }

  requestAuth(authRequest: AuthRequest): Observable<ResourceCreationInfo> {
    return this.http.post<ResourceCreationInfo>(this.authRequestUrl, authRequest)
      .pipe(
        tap(_ => console.log('requestAuth')),
        catchError(this.handleError<ResourceCreationInfo>('requestAuth'))
      );
  }

  responseAuth(authResponse: AuthResponse): Observable<ResourceCreationInfo> {
    return this.http.post<ResourceCreationInfo>(this.authResponseUrl, authResponse)
      .pipe(
        tap(_ => console.log('responseAuth')),
        catchError(this.handleError<ResourceCreationInfo>('responseAuth'))
      );
  }

  getAuthSessionById(id: string): Observable<AuthSession> {
    return this.http.get<AuthSession>(this.authUrl + '/' + id)
      .pipe(
        tap(_ => console.log('getAuthSessionById')),
        catchError(this.handleError<AuthSession>('getAuthSessionById'))
      );
  }

  getAuthSessionRecordIds(isLatestFirst = true, pageSize = 10, bookmark = ''): Observable<TableRecordData> {
    return this.http.get<TableRecordData>(this.authRecordUrl, {
      params: new HttpParams()
        .set('isLatestFirst', isLatestFirst)
        .set('pageSize', pageSize)
        .set('bookmark', bookmark)
    })
      .pipe(
        tap(_ => console.log('getAuthSessionRecordIds'
          + '\nisLatestFirst: ' + isLatestFirst
          + '\npageSize: ' + pageSize
          + '\nbookmark: ' + bookmark)),
        catchError(this.handleError<TableRecordData>('getAuthSessionRecordIds'))
      );
  }

  getAuthSessionApproveIds(pageSize = 10, bookmark = ''): Observable<TableRecordData> {
    return this.http.get<TableRecordData>(this.authApproveUrl, {
      params: new HttpParams()
        .set('pageSize', pageSize)
        .set('bookmark', bookmark)
    })
      .pipe(
        tap(_ => console.log('getAuthSessionApproveIds'
          + '\npageSize: ' + pageSize
          + '\nbookmark: ' + bookmark)),
        catchError(this.handleError<TableRecordData>('getAuthSessionApproveIds'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
