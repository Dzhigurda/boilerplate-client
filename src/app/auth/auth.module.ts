import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRouterModule } from "./auth-router/auth-router.module";
import { LoginComponent } from './login/login.component';
import { BaseComponent } from './base/base.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {TuiInputModule} from '@taiga-ui/kit';
import {TuiInputPasswordModule} from '@taiga-ui/kit';
import {TuiCheckboxModule} from '@taiga-ui/kit';
import {TuiCheckboxLabeledModule, } from '@taiga-ui/kit';
import {TuiButtonModule} from '@taiga-ui/core';
import {TuiNotificationsModule, TuiRootModule} from '@taiga-ui/core';
import { AutorizationComponent } from './autorization/autorization.component';
import { RemindComponent } from './remind/remind.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RemindInfoComponent } from './remind-info/remind-info.component';
import { TwoFactorAuthenticatorComponent } from './two-factor-authenticator/two-factor-authenticator.component';

@NgModule({
  declarations: [
    LoginComponent,
    BaseComponent,
    AutorizationComponent,
    RemindComponent,
    ChangePasswordComponent,
    RemindInfoComponent,
    TwoFactorAuthenticatorComponent, 
  ],
  imports: [
    CommonModule,
    AuthRouterModule,
    FormsModule,
    RouterModule,
    TuiInputModule,
    ReactiveFormsModule,
    TuiInputPasswordModule,
    TuiCheckboxModule,
    TuiCheckboxLabeledModule,
    TuiButtonModule,
    TuiRootModule,
    TuiNotificationsModule
  ]
})
export class AuthModule { }
