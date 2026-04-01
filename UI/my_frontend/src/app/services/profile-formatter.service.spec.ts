import { TestBed } from '@angular/core/testing';

import { ProfileFormatterService } from './profile-formatter.service.js';

describe('ProfileFormatterServiceTs', () => {
  let service: ProfileFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
