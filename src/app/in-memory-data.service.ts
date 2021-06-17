import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  // TODO: implement InMemoryDataService
  createDb() {
    const data = [
      { id: 1, name: 'foo' },
      { id: 2, name: 'bar' }
    ];
    return { data };
  }

  genId() { }
}
