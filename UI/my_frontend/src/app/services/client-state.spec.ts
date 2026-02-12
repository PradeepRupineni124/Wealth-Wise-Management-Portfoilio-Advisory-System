import { TestBed } from '@angular/core/testing';

import { ClientState } from './client-state';

describe('ClientState', () => {
  let service: ClientState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
