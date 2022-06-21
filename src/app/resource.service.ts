import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AssetMetadata } from './asset-metadata';
import { DocumentMetadata } from './document-metadata';
import { NotificationComponent } from './notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private resourceUrl = (): string => { return environment.apiEndpoint + '/resource' };

  constructor(private http: HttpClient, private notificationComponent: NotificationComponent) { }

  getResourceMetadataById(id: string): Observable<DocumentMetadata | AssetMetadata> {
    return this.http.get<DocumentMetadata | AssetMetadata>(this.resourceUrl() + '/' + id + '/metadata')
      .pipe(
        tap(_ => console.log('getResourceMetadataById')),
        catchError(this.handleError<DocumentMetadata | AssetMetadata>('getResourceMetadataById'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.error) {
        console.error(`${operation} failed: ${error.message}\n${error.error}`);
        this.notificationComponent.showError(`${error.status} ${error.statusText}: ${error.error}`);
      } else {
        console.error(`${operation} failed: ${error.message}`);
        this.notificationComponent.showError(`${error.status} ${error.statusText}`);
      }

      return of(result as T);
    };
  }
}
