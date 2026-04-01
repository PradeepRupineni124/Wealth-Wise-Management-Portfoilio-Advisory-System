import { TestBed } from '@angular/core/testing';

import { AdvisoryService } from './advisory.service';

describe('AdvisoryService', () => {
  let service: AdvisoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvisoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
