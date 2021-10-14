import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthRequest } from './auth-request';
import { ResourceCreationInfo } from './resource-creation-info';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authRequestUrl = environment.apiEndpoint + '/auth/request';

  constructor(private http: HttpClient) { }

  requestAuth(authRequest: AuthRequest): Observable<ResourceCreationInfo> {
    return this.http.post<ResourceCreationInfo>(this.authRequestUrl, authRequest)
      .pipe(
        tap(_ => console.log('requestAuth')),
        catchError(this.handleError<ResourceCreationInfo>('requestAuth'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
