import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutorizationComponent } from '../autorization/autorization.component';
import { BaseComponent } from '../base/base.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { LoginComponent } from '../login/login.component';
import { RemindInfoComponent } from '../remind-info/remind-info.component';
import { RemindComponent } from '../remind/remind.component';
import { TwoFactorAuthenticatorComponent } from '../two-factor-authenticator/two-factor-authenticator.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      { path: 'login', pathMatch: 'full', component: LoginComponent },
      { path: '2fa', pathMatch: 'full', component: TwoFactorAuthenticatorComponent },
      {
        path: 'registration',
        pathMatch: 'full',
        component: AutorizationComponent,
      },
      { path: 'remind', pathMatch: 'full', component: RemindComponent },
      {
        path: 'remind/success',
        pathMatch: 'full',
        component: RemindInfoComponent,
      },
      { path: 'remind/:id/:code', component: ChangePasswordComponent }, 
      { path: '**', component: LoginComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRouterModule {}
