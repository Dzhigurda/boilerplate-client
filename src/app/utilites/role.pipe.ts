import { Pipe, PipeTransform } from '@angular/core';
import { RoleService, UserRole } from '../profile/role.service';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {
  constructor(private roleService: RoleService) {}

  /**
   * Возвращает объект, который отражает название роли
   * @param value Номер роли 
   * @returns объект UserRole
   */
  transform(value: number, ...args: any[]): UserRole {
    return this.roleService.getOne(value)!;
  }

}
