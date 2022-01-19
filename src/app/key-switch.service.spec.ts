import { TestBed } from '@angular/core/testing';

import { KeySwitchService } from './key-switch.service';

describe('KeySwitchService', () => {
  let service: KeySwitchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeySwitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
