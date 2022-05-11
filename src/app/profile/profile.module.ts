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
  TuiFieldErrorPipeModule,
  TuiInputDateModule,
  TuiInputNumberModule,
  TuiInputPasswordModule,
  TuiMultiSelectModule,
  TuiProgressModule,
  TuiTabsModule,
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
  TuiErrorModule,
  TuiFormatNumberPipeModule,
  TuiHintModule,
  TuiLabelModule,
  TuiLinkModule,
  TuiPrimitiveTextfieldModule,
  TuiScrollbarModule,
  TuiTooltipModule,
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
import { ArticlesComponent } from './articles/articles.component';
import { ArticlesItemComponent } from './articles-item/articles-item.component';
import { TimeAgoExtendsPipe } from '../utilites/TimeAgoExtends.pipe';
import { EditorComponent } from './editor/editor.component';
import { Ng4FilesModule } from '../utilites/ng4-files';
import { ArticleModule } from './editor/article/article.module';

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
    ArticlesComponent,
    ArticlesItemComponent,
    TimeAgoExtendsPipe,
    EditorComponent,
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
    TuiMultiSelectModule,
    TuiTooltipModule,
    TuiHintModule,
    TuiTabsModule,
    MarkdownModule.forRoot(),
    Ng4FilesModule,
    ArticleModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule 
  ],
})
export class ProfileModule {}
