import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

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

  getUserInfo(): Observable<string> {
    return this.http.get<string>(this.identityUrl)
      .pipe(
        tap(_ => console.log('getUserInfo')),
        catchError(this.handleError<string>('getUserInfo', 'Unknown (Unknown)'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
