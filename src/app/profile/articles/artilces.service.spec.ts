import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ArtilcesService } from './artilces.service';

describe('ArtilcesService', () => {
  let service: ArtilcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(ArtilcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
