import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TuiNotificationsService } from '@taiga-ui/core';
import { ClientUser } from 'src/app';
import { TaskPresenter } from '../Task';
import { TaskService } from '../task.service';

import { ControlComponent } from './control.component';

describe('ControlComponent', () => {
  let component: ControlComponent;
  let fixture: ComponentFixture<ControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlComponent ],
      providers: [ TaskService ],
      imports: [HttpClientTestingModule, CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlComponent);
    component = fixture.componentInstance;
    component.user = new ClientUser();
    component.task = new TaskPresenter();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
