import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { UploadResult } from './asset';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private url = 'http://localhost:1080';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
  };

  constructor(private http: HttpClient) { }

  uploadAsset(asset: FormData): Observable<UploadResult> {
    const assetUrl = `${this.url}/asset`;
    return this.http.post<UploadResult>(assetUrl, asset, this.httpOptions).pipe(
      tap(result => console.info('Upload Asset Result:', result)),
      catchError(this.handleError<UploadResult>('uploadAsset'))
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
