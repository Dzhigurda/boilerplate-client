import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindComponent } from './remind.component';

describe('RemindComponent', () => {
  let component: RemindComponent;
  let fixture: ComponentFixture<RemindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemindComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
