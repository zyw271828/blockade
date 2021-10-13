import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  constructor() { }

  checkConnectivity(): Observable<boolean> {
    // TODO: check connectivity
    const isConnected = of(true);
    return isConnected;
  }

  getUserInfo(): Observable<string> {
    // TODO: get user information
    const userInfo = of('Username (Identity)');
    return userInfo;
  }
}
