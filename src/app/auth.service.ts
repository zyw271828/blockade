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

  private authUrl = (): string => { return environment.apiEndpoint + '/auth' };
  private authRequestUrl = (): string => { return environment.apiEndpoint + '/auth/request' };
  private authResponseUrl = (): string => { return environment.apiEndpoint + '/auth/response' };
  private authRecordUrl = (): string => { return environment.apiEndpoint + '/identity/auths/request-list' };
  private authApproveUrl = (): string => { return environment.apiEndpoint + '/identity/auths/pending-list' };

  constructor(private http: HttpClient) { }

  requestAuth(authRequest: AuthRequest): Observable<ResourceCreationInfo> {
    return this.http.post<ResourceCreationInfo>(this.authRequestUrl(), authRequest)
      .pipe(
        tap(_ => console.log('requestAuth')),
        catchError(this.handleError<ResourceCreationInfo>('requestAuth'))
      );
  }

  responseAuth(authResponse: AuthResponse): Observable<ResourceCreationInfo> {
    return this.http.post<ResourceCreationInfo>(this.authResponseUrl(), authResponse)
      .pipe(
        tap(_ => console.log('responseAuth')),
        catchError(this.handleError<ResourceCreationInfo>('responseAuth'))
      );
  }

  getAuthSessionById(id: string): Observable<AuthSession> {
    return this.http.get<AuthSession>(this.authUrl() + '/' + id)
      .pipe(
        tap(_ => console.log('getAuthSessionById')),
        catchError(this.handleError<AuthSession>('getAuthSessionById'))
      );
  }

  getAuthSessionRecordIDs(isLatestFirst = true, pageSize = 10, bookmark = ''): Observable<TableRecordData> {
    return this.http.get<TableRecordData>(this.authRecordUrl(), {
      params: new HttpParams()
        .set('isLatestFirst', isLatestFirst)
        .set('pageSize', pageSize)
        .set('bookmark', bookmark)
    })
      .pipe(
        tap(_ => console.log('getAuthSessionRecordIDs'
          + '\nisLatestFirst: ' + isLatestFirst
          + '\npageSize: ' + pageSize
          + '\nbookmark: ' + bookmark)),
        catchError(this.handleError<TableRecordData>('getAuthSessionRecordIDs'))
      );
  }

  getAuthSessionApproveIDs(pageSize = 10, bookmark = ''): Observable<TableRecordData> {
    return this.http.get<TableRecordData>(this.authApproveUrl(), {
      params: new HttpParams()
        .set('pageSize', pageSize)
        .set('bookmark', bookmark)
    })
      .pipe(
        tap(_ => console.log('getAuthSessionApproveIDs'
          + '\npageSize: ' + pageSize
          + '\nbookmark: ' + bookmark)),
        catchError(this.handleError<TableRecordData>('getAuthSessionApproveIDs'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
