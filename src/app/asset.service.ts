import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Asset } from './asset';
import { ResourceCreationInfo } from './resource-creation-info';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private assetUrl = environment.apiEndpoint + '/asset';

  constructor(private http: HttpClient) { }

  uploadAsset(asset: Asset): Observable<ResourceCreationInfo> {
    return this.http.post<ResourceCreationInfo>(this.assetUrl, asset)
      .pipe(
        tap(_ => console.log('uploadAsset')),
        catchError(this.handleError<ResourceCreationInfo>('uploadAsset'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
