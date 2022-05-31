import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormAlbumComponent } from './search-form-album.component';

describe('SearchFormAlbumComponent', () => {
  let component: SearchFormAlbumComponent;
  let fixture: ComponentFixture<SearchFormAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchFormAlbumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
