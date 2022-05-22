import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NotAuthGuard } from './not-auth.guard';

describe('NotAuthGuard', () => {
  let guard: NotAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    guard = TestBed.inject(NotAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
