import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FeeService } from './fee.service';

describe('FeeService', () => {
  let service: FeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
   });
    service = TestBed.inject(FeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
