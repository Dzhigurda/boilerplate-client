import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IamComponent } from './iam/iam.component';
import { BaseComponent } from './base/base.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRouterModule } from './profile-router/profile-router.module';
import { TuiMobileDialogModule } from '@taiga-ui/addon-mobile';
import {
  TuiAccordionModule,
  TuiBadgedContentModule,
  TuiInputDateModule,
  TuiInputNumberModule,
  TuiInputPasswordModule,
  TuiProgressModule,
  TuiTagModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';

import {
  TuiCheckboxModule,
  TuiCheckboxLabeledModule,
  TuiInputModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiSelectModule,
  TuiInputPhoneModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiFormatNumberPipeModule,
  TuiLabelModule,
  TuiLinkModule,
  TuiPrimitiveTextfieldModule,
  TuiScrollbarModule,
} from '@taiga-ui/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { OverviewComponent } from './overview/overview.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TuiFilterModule } from '@taiga-ui/kit';
import { TuiFilterByInputPipeModule } from '@taiga-ui/kit';
import { ContactComponent } from './iam/contact/contact.component';
import { TestComponent } from './test/test.component';
import { TaskComponent } from './task/task.component';
import { RoleComponent } from './iam/role/role.component';
import { SettingsComponent } from './iam/settings/settings.component';
import { LoginComponent } from './iam/login/login.component';
import { ContactsComponent } from './iam/contacts/contacts.component';
import { DeleteComponent } from './iam/delete/delete.component';
import {
  TuiAxesModule,
  TuiBarChartModule,
  TuiLegendItemModule,
  TuiRingChartModule,
} from '@taiga-ui/addon-charts';
import {
  TuiCurrencyPipeModule,
  TuiMoneyModule,
} from '@taiga-ui/addon-commerce';
import { VerifyComponent } from './verify/verify.component';
import { UsersComponent } from './users/users.component';
import {
  TuiTableModule,
  TuiTablePaginationModule,
} from '@taiga-ui/addon-table';
import { RolePipe } from '../utilites/role.pipe';
import { HistoryComponent } from './task/history/history.component';
import { InformationWithFormEditorComponent } from './task/information-with-form-editor/information-with-form-editor.component';
import { InformationWithFormArticleComponent } from './task/information-with-form-article/information-with-form-article.component';
import { InformationWithFormGuestComponent } from './task/information-with-form-guest/information-with-form-guest.component';
import { AboutComponent } from './task/about/about.component';
import { TaskItemComponent } from './task/task-item/task-item.component';
import { ControlComponent } from './task/control/control.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    IamComponent,
    BaseComponent,
    OverviewComponent,
    ContactComponent,
    TestComponent,
    TaskComponent,
    RoleComponent,
    SettingsComponent,
    LoginComponent,
    ContactsComponent,
    DeleteComponent,
    VerifyComponent,
    UsersComponent,
    RolePipe,
    HistoryComponent,
    InformationWithFormEditorComponent,
    InformationWithFormArticleComponent,
    InformationWithFormGuestComponent,
    AboutComponent,
    TaskItemComponent,
    ControlComponent,
  ],
  imports: [
    ProfileRouterModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TuiCheckboxModule,
    TuiCheckboxLabeledModule,
    TuiLinkModule,
    TuiSvgModule,
    TuiInputModule,
    TuiComboBoxModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiScrollbarModule,
    ScrollingModule,
    TuiButtonModule,
    TuiFilterModule,
    TuiFilterByInputPipeModule,
    TuiSelectModule,
    TuiInputPhoneModule,
    TuiPrimitiveTextfieldModule,
    TuiMobileDialogModule,
    TuiInputPasswordModule,
    TuiLegendItemModule,
    TuiRingChartModule,
    TuiMoneyModule,
    TuiBarChartModule,
    TuiAxesModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiSvgModule,
    TuiAccordionModule,
    TuiBadgedContentModule,
    TuiInputNumberModule,
    TuiCurrencyPipeModule,
    TuiProgressModule,
    TuiTagModule,
    TuiInputDateModule,
    TuiFormatNumberPipeModule,
    TuiLabelModule,
    TuiTextAreaModule,
    MarkdownModule.forRoot(),
  ],
})
export class ProfileModule {}
