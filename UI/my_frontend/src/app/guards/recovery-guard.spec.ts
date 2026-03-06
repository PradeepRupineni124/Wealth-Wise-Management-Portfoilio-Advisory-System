import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { recoveryGuard } from './recovery-guard';

describe('recoveryGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => recoveryGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
