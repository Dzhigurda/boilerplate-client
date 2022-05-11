import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteArtComponent } from './quote-art.component';

describe('QuoteArtComponent', () => {
  let component: QuoteArtComponent;
  let fixture: ComponentFixture<QuoteArtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteArtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
