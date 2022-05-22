import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClientUser } from 'src/app';
import { userTester } from 'src/app/testing/userMock';
import { TaskPresenter } from '../Task';

import { InformationWithFormEditorComponent } from './information-with-form-editor.component';

describe('InformationWithFormEditorComponent', () => {
  let component: InformationWithFormEditorComponent;
  let fixture: ComponentFixture<InformationWithFormEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      declarations: [ InformationWithFormEditorComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationWithFormEditorComponent);
    component = fixture.componentInstance;
    component.task  = new TaskPresenter();
    component.user = new ClientUser().restore(userTester);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
