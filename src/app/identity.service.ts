import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { UserIdentity } from './user-identity';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  private connectivityUrl = environment.apiEndpoint + '/connectivity';
  private identityUrl = environment.apiEndpoint + '/identity';

  constructor(private http: HttpClient) { }

  checkConnectivity(): Observable<boolean> {
    return this.http.get<boolean>(this.connectivityUrl)
      .pipe(
        tap(_ => console.log('checkConnectivity')),
        catchError(this.handleError<boolean>('checkConnectivity', false))
      );
  }

  getUserIdentity(): Observable<UserIdentity> {
    return this.http.get<UserIdentity>(this.identityUrl)
      .pipe(
        tap(_ => console.log('getUserIdentity')),
        catchError(this.handleError<UserIdentity>('getUserIdentity'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
