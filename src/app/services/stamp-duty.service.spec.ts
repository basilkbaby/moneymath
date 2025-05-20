import { TestBed } from '@angular/core/testing';

import { StampDutyService } from './stamp-duty.service';

describe('StampDutyService', () => {
  let service: StampDutyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StampDutyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
