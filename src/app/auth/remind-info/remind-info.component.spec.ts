import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindInfoComponent } from './remind-info.component';

describe('RemindInfoComponent', () => {
  let component: RemindInfoComponent;
  let fixture: ComponentFixture<RemindInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemindInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemindInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
