import { Injectable } from '@angular/core';
import { of, switchMap } from 'rxjs';
import { ClientUser } from 'src/app';
import { UserService } from 'src/app/user.service';
import { ArtilcesService } from '../artilces/artilces.service';
import { RoleService } from '../role.service';
import { ClientUserTumbanian, FakeMMTask, TaskPresenter } from './Task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private items: FakeMMTask[] = [
    {
      id: 1,
      title: 'Написать статью про ТОП 10 музыкантов',
      description: 'Эти музыканты должны быть из Вьетнама или Кореи...',
      status: 'PUBLISHED',

      editor: 1,
      dateEnd: new Date('2022-05-08'),
      fee: 300,
    },
    {
      id: 2,
      title: 'Топ 5 женщин из кино',
      description: 'Эти женщины должны быть объеденены одной профессией',
      fee: 180,
      editor: 2,
      author: 1,
      dateEnd: new Date('2022-06-08'),
      status: 'DISTRIBUTED',
    },
    {
      id: 3,
      title: 'Эпоха дворцовых переворотов',
      description: ` Путешествие по местам питера **test** any *test*
      
      * пункт 1
      * пункт 2
      `,
      fee: 180,
      editor: 1,
    },
  ];
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private articleService: ArtilcesService
  ) {}

  getAllTask() {
    return this.userService.getAll().pipe(
      switchMap((users: ClientUser[]) => {
        const usersRef = users.map((r) =>
          new ClientUserTumbanian().restore(
            r,
            this.roleService.getOne(r.role).value
          )
        );
        const articles = this.articleService.getAllForTask();
        const result = this.items.map((r) =>
          TaskPresenter.create(r, usersRef, articles)
        );
        return of(result);
      })
    );
  }

  getConfig() {
    return {
      defaultDuration: new Date(+new Date() + 1000 * 60 * 60 * 24 * 14),
      defaultFee: 150,
    };
  }
}
