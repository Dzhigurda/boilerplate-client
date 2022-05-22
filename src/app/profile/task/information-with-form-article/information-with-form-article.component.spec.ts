import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClientUser } from 'src/app';
import { baseTasks } from 'src/app/testing/taskMock';
import { users, userTester } from 'src/app/testing/userMock';
import { UserService } from 'src/app/user.service';
import { TaskPresenter, FakeMMTask, ClientUserTumbanian } from '../Task';
import { TaskService } from '../task.service';
import { UserTumbanianFactory } from '../UserTumbanianFactory';

import { InformationWithFormArticleComponent } from './information-with-form-article.component';

describe('InformationWithFormArticleComponent', () => {
  let component: InformationWithFormArticleComponent;
  let fixture: ComponentFixture<InformationWithFormArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformationWithFormArticleComponent],
      providers: [TaskService, UserTumbanianFactory, UserService],
      imports: [HttpClientTestingModule, RouterTestingModule, CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationWithFormArticleComponent);
    component = fixture.componentInstance;
    component.task = TaskPresenter.create(
      baseTasks[0] as any,
      users.map((r) =>
        new ClientUserTumbanian().restore(new ClientUser().restore(r), 'TEST')
      ),
      []
    );
    component.user = new ClientUser().restore(userTester);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
