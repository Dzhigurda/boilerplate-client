import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormPhotoComponent } from './search-form-photo.component';

describe('SearchFormPhotoComponent', () => {
  let component: SearchFormPhotoComponent;
  let fixture: ComponentFixture<SearchFormPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchFormPhotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
