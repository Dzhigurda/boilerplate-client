import { TestBed } from '@angular/core/testing';

import { ArtilcesService } from './artilces.service';

describe('ArtilcesService', () => {
  let service: ArtilcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtilcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
