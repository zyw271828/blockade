import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthCreationInfo } from './auth-creation-info';
import { AuthRequest } from './auth-request';
import { AuthResponse } from './auth-response';
import { AuthSession } from './auth-session';
import { NotificationComponent } from './notification/notification.component';
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

  constructor(private http: HttpClient, private notificationComponent: NotificationComponent) { }

  requestAuth(authRequest: AuthRequest): Observable<AuthCreationInfo> {
    let formData = new FormData();

    (Object.keys(authRequest) as Array<keyof typeof authRequest>).map(name => {
      let value: any = authRequest[name];

      formData.set(name, value);
    });

    return this.http.post<AuthCreationInfo>(this.authRequestUrl(), formData)
      .pipe(
        tap(_ => console.log('requestAuth')),
        catchError(this.handleError<AuthCreationInfo>('requestAuth'))
      );
  }

  responseAuth(authResponse: AuthResponse): Observable<AuthCreationInfo> {
    let formData = new FormData();

    (Object.keys(authResponse) as Array<keyof typeof authResponse>).map(name => {
      let value: any = authResponse[name];

      formData.set(name, value);
    });

    return this.http.post<AuthCreationInfo>(this.authResponseUrl(), formData)
      .pipe(
        tap(_ => console.log('responseAuth')),
        catchError(this.handleError<AuthCreationInfo>('responseAuth'))
      );
  }

  getAuthSessionById(id: string): Observable<AuthSession> {
    return this.http.get<AuthSession>(this.authUrl() + '/' + id)
      .pipe(
        tap(_ => console.log('getAuthSessionById')),
        catchError(this.handleError<AuthSession>('getAuthSessionById'))
      );
  }

  getAuthSessionRecordIds(isLatestFirst = true, pageSize = 10, bookmark = ''): Observable<TableRecordData> {
    return this.http.get<TableRecordData>(this.authRecordUrl(), {
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
    return this.http.get<TableRecordData>(this.authApproveUrl(), {
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
      if (error.error) {
        console.error(`${operation} failed: ${error.message}\n${error.error}`);
        this.notificationComponent.showError(`${error.status} ${error.statusText}：${error.error}`);
      } else {
        console.error(`${operation} failed: ${error.message}`);
        this.notificationComponent.showError(`${error.status} ${error.statusText}`);
      }

      return of(result as T);
    };
  }
}
