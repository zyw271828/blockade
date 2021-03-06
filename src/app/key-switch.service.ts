import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { KeySwitchCreationInfo } from './key-switch-creation-info';
import { KeySwitchTrigger } from './key-switch-trigger';
import { NotificationComponent } from './notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class KeySwitchService {

  private keySwitchTriggerUrl = environment.apiEndpoint + '/ks/trigger';

  constructor(private http: HttpClient, private notificationComponent: NotificationComponent) { }

  createKeySwitchTrigger(keySwitchTrigger: KeySwitchTrigger): Observable<KeySwitchCreationInfo> {
    let formData = new FormData();

    (Object.keys(keySwitchTrigger) as Array<keyof typeof keySwitchTrigger>).map(name => {
      let value: any = keySwitchTrigger[name];

      formData.set(name, value);
    });

    return this.http.post<KeySwitchCreationInfo>(this.keySwitchTriggerUrl, formData)
      .pipe(
        tap(_ => console.log('createKeySwitchTrigger')),
        catchError(this.handleError<KeySwitchCreationInfo>('createKeySwitchTrigger'))
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
