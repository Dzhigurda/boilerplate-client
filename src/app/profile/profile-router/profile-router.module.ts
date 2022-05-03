import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IamComponent } from '../iam/iam.component';
import { BaseComponent } from '../base/base.component';
import { PageNotFoundComponent } from 'src/app/page-not-found/page-not-found.component';
import { OverviewComponent } from '../overview/overview.component';
import { TestComponent } from '../test/test.component';
import { TaskComponent } from '../task/task.component';
import { VerifyComponent } from '../verify/verify.component';
import { UsersComponent } from '../users/users.component';

const routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      { path: 'iam', component: IamComponent },
      { path: 'task', component: TaskComponent },
      { path: 'test', component: TestComponent, data: { test: true } },
      { path: 'verify/:code', component: VerifyComponent },
      { path: 'users', component: UsersComponent },
      { path: '', pathMatch: 'full', component: OverviewComponent },
      { path: '**', component: PageNotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRouterModule {}
