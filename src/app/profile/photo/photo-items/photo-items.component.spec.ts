import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoItemsComponent } from './photo-items.component';

describe('PhotoItemsComponent', () => {
  let component: PhotoItemsComponent;
  let fixture: ComponentFixture<PhotoItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
