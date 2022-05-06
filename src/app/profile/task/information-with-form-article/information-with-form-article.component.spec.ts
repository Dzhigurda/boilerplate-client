import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationWithFormArticleComponent } from './information-with-form-article.component';

describe('InformationWithFormArticleComponent', () => {
  let component: InformationWithFormArticleComponent;
  let fixture: ComponentFixture<InformationWithFormArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationWithFormArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationWithFormArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
