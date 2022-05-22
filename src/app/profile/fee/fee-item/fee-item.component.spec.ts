import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskFee } from '../Fee';

import { FeeItemComponent } from './fee-item.component';

describe('FeeItemComponent', () => {
  let component: FeeItemComponent;
  let fixture: ComponentFixture<FeeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [FeeItemComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeItemComponent);
    component = fixture.componentInstance;
    component.fee = new TaskFee().restore({comment: "TEST"} as any)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
