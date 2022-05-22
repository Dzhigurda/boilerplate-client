import { Pipe, PipeTransform } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AccessItem, RoleService, UserRole } from '../profile/role.service';

@Pipe({
  name: 'role',
})
export class RolePipe implements PipeTransform {
  constructor() {}

  /**
   * Возвращает название прав 
   * @param value Номер  права
   * @returns объект UserRole
   */
  transform(value: AccessItem, ...args: any[]): string {
    switch(value) {
      case AccessItem.CAN_SEE_USERS: return "Может видеть пользователей";
      case AccessItem.CAN_SEE_TASKS: return "Может видеть задания";
      case AccessItem.CAN_SEE_ARTICLE: return "Может видеть статьи";
      case AccessItem.CAN_SEE_FEE: return "Может видеть гонорары";
      case AccessItem.CAN_SEE_ANALITYCS: return "Может видеть аналитику по статьям";
      case AccessItem.CAN_SEE_PHOTO: return "Может видеть фотографии";
      case AccessItem.CAN_SEE_FEE_REPORTS: return "Может видеть отчёт по гонорарам";
      case AccessItem.CAN_SEE_ANALITYCS_PHOTO: return "Может видеть аналитику по фотографиям";
      case AccessItem.CAN_SEE_TEST: return "Может видеть страницу для дебага";
      case AccessItem.CAN_CREATE_ARTICLE: return "Может создавать статьи";
      case AccessItem.CAN_CREATE_TASK: return "Может создавать задания";
      case AccessItem.CAN_HAVE_TASK: return "Может иметь задания";
      case AccessItem.CAN_BE_EDITOR_IN_TASK: return "Может быть редактором в задании";
      case AccessItem.CAN_PUT_AUTHOR_IN_TASK: return "Может назначать автора в задания";
      case AccessItem.CAN_PUT_EDITOR_IN_TASK: return "Может назначать редактора в задания";
      case AccessItem.CAN_PUBLISH_ARTICLE: return "Может публиковать статьи";
      case AccessItem.CAN_CHANGE_ROLE: return "Может менять роли";
      case AccessItem.CAN_PAY_FEE: return "Может выплачивать гонорары"; 
      case AccessItem.CAN_EDIT_CATEGORY: return "Может редактировать категории"; 
    }
    return "-";
  }
}
