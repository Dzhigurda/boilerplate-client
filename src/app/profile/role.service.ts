import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../../../../server/src/domains/user';

export interface Role {
  id: number;
  value: string;
  comment: string;
}

export class UserRole implements Role {
  id!: number;
  value!: string;
  comment!: string;

  restore(role: Role) {
    this.id = role.id;
    this.value = role.value;
    this.comment = role.comment;
    return this;
  }

  toString() {
    return this.value;
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
  readonly items = [
    {
      id: 1,
      value: 'Читатель',
      comment: 'Может собирать понравившиеся статьи в коллекции.',
    },
    {
      id: 2,
      value: 'Стажёр',
      comment:
        'Проходит стажировку в журнале, должен выполнять задачи согласно плана стажировки.',
    },
    {
      id: 3,
      value: 'Журналист',
      comment:
        'Пишет статьи по редакционному заданию, может посещать редколлегии и предлагать материалы',
    },
    {
      id: 4,
      value: 'Ньюсмейкер',
      comment:
        'Пишет новости по пресс релизам или собирает материалы из открытых источников',
    },
    {
      id: 5,
      value: 'PR менеджер',
      comment: 'Размещает статьи и новости своей группы или своего артиста.',
    },
    {
      id: 6,
      value: 'Редактор',
      comment:
        'Принимает статьи, отвечает за их своевременную публикацию, создаёт редакционные задачи',
    },
    {
      id: 7,
      value: 'Администратор',
      comment:
        'Администрирует сотрудников журнала, выдаёт права, может блокировать и удалять любых пользователей',
    },
  ].map((r) => new UserRole().restore(r));

  emptyRole = new UserRole().restore({ id: 0, value: 'Не определена', comment: '-' });
  constructor(private http: HttpClient) {}

  getAll() {
    return this.items;
  }

  getOne(id: number) {
    return this.items.find((r) => r.id === id) ?? this.emptyRole;
  }

  changeRole(userId: number, roleId: number) {
    return this.http.patch<User>(environment.API_URL + '/v1/user/role', {
      userId: userId,
      roleId: roleId,
    });
  }
}
