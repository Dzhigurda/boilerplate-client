import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesItemComponent } from './articles-item.component';

describe('ArticlesItemComponent', () => {
  let component: ArticlesItemComponent;
  let fixture: ComponentFixture<ArticlesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
