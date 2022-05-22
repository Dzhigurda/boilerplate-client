import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeAgoPipe } from 'time-ago-pipe';
import { ArtilceTumbanian } from '../artilces.service';

import { ArticlesItemComponent } from './articles-item.component';

describe('ArticlesItemComponent', () => {
  let component: ArticlesItemComponent;
  let fixture: ComponentFixture<ArticlesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticlesItemComponent, TimeAgoPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesItemComponent);
    component = fixture.componentInstance;
    component.article = new ArtilceTumbanian();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
