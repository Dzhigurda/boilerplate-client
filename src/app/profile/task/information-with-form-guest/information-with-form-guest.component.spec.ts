import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationWithFormGuestComponent } from './information-with-form-guest.component';

describe('InformationWithFormGuestComponent', () => {
  let component: InformationWithFormGuestComponent;
  let fixture: ComponentFixture<InformationWithFormGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationWithFormGuestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationWithFormGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
