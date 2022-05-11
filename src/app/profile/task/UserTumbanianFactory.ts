import { Injectable } from '@angular/core';
import { of, switchMap } from 'rxjs';
import { ClientUser } from 'src/app';
import { UserService } from 'src/app/user.service';
import { AccessItem } from '../role.service';
import { ClientUserTumbanian } from './Task';

@Injectable({
  providedIn: 'root',
})
export class UserTumbanianFactory {
  static users: Map<number, ClientUserTumbanian> = new Map();
  constructor(private userService: UserService) {}

  takeAllAuthor() {
    return this.userService.getAll().pipe(
      switchMap((users) => {
        const authors = users.filter((u) =>
          u.roleRef.right.includes(AccessItem.CAN_HAVE_TASK)
        );
        const editors = users.filter((u) =>
          u.roleRef.right.includes(AccessItem.CAN_CREATE_TASK)
        );
        return of({ authors, editors });
      })
    );
  }

  createFromClientUser(user: ClientUser): ClientUserTumbanian {
    if (UserTumbanianFactory.users.has(user.id))
      return UserTumbanianFactory.users.get(user.id)!;
    const u = new ClientUserTumbanian().restore(user, user.roleRef.name);
    UserTumbanianFactory.users.set(user.id, u);
    return u;
  }
  create(user: any) {
    if (UserTumbanianFactory.users.has(user.id))
      return UserTumbanianFactory.users.get(user.id);
    const u = new ClientUserTumbanian().restore(user, user.roleName);
    UserTumbanianFactory.users.set(user.id, u);
    return u;
  }
}
