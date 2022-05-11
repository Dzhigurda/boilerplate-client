import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../../../server/src/domains/user';

export enum AccessItem {
  CAN_SEE_USERS = 1,
  CAN_SEE_TASKS,
  CAN_SEE_ARTICLE,
  CAN_SEE_FEE,
  CAN_SEE_ANALITYCS,
  CAN_SEE_PHOTO,
  CAN_SEE_FEE_REPORTS,
  CAN_SEE_ANALITYCS_PHOTO,
  CAN_SEE_TEST,
  CAN_CREATE_ARTICLE,
  CAN_CREATE_TASK,
  CAN_HAVE_TASK,
  CAN_BE_EDITOR_IN_TASK,
  CAN_PUT_AUTHOR_IN_TASK,
  CAN_PUT_EDITOR_IN_TASK,
  CAN_PUBLISH_ARTICLE,
  CAN_CHANGE_ROLE,
  CAN_PAY_FEE,
}

export interface Role {
  id: number;
  name: string;
  comment: string;
  right: AccessItem[];
}

export class UserRole implements Role {
  id!: number;
  name!: string;
  comment!: string;
  right: AccessItem[] = [];
  restore(role: Role) {
    console.log(role);
    this.id = role.id;
    this.name = role.name;
    this.comment = role.comment;
    this.right = role.right;
    return this;
  }

  toString() {
    return this.name;
  }
  getId() {
    return this.id;
  }
  valueOf() {
    return this.id;
  }
}
@Injectable({
  providedIn: 'root',
})
export class RoleService {
  readonly emptyRole = new UserRole().restore({
    id: 0,
    name: 'Не определена',
    comment: '-',
    right: [],
  });
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get<Role[]>(environment.API_URL + '/v1/user/role')
      .pipe(map((roles) => roles.map((r) => new UserRole().restore(r))));
  }

  getOne(id: number) {
    return this.http
      .get<Role>(environment.API_URL + '/v1/user/role/' + id)
      .pipe(map((role) => new UserRole().restore(role)));
  }

  changeRole(userId: number, roleId: number) {
    return this.http.patch<User>(environment.API_URL + '/v1/user/role', {
      userId: userId,
      roleId: roleId,
    });
  }
}
