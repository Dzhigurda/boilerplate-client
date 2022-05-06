import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationWithFormEditorComponent } from './information-with-form-editor.component';

describe('InformationWithFormEditorComponent', () => {
  let component: InformationWithFormEditorComponent;
  let fixture: ComponentFixture<InformationWithFormEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationWithFormEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationWithFormEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
