import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ClientUser } from 'src/app';

import { TuiComparator } from '@taiga-ui/addon-table';
import { toInt, TuiDay } from '@taiga-ui/cdk';
import { FormControl, FormGroup } from '@angular/forms';
import { Role, RoleService, UserRole } from '../role.service';
import { debounceTime } from 'rxjs';
import { UserService } from 'src/app/user.service';

interface User {
  readonly name: string;
  readonly dob: TuiDay;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  @Input()
  user!: ClientUser;

  readonly form = new FormGroup({
    filters: new FormControl([]),
  });
  users: ClientUser[] = [];
  items: (UserRole & { count: number })[] = [];

  enabledLogin: Role[] = [];
  constructor(
    private roleService: RoleService,
    private userService: UserService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.items = this.roleService.getAll().map((r) => {
      return Object.assign(r, {
        count: 0,
        valueOf: function () {
          return this.count;
        },
      });
    });
    this.form.valueChanges.pipe(debounceTime(100)).subscribe((part) => {
      console.log(part.filters);
      this.enabledLogin = part.filters;
      this.filters();
    });
    this.userService.getAll().subscribe((r) => {
      this.users = r;
      for (let i of this.users) {
        const role = this.items.find((role) => role.id === i.role); 
        role!.count += 1;
      }
      this.ref.detectChanges();
      this.filters();
    });
  }

  filters() {
    if (this.enabledLogin.length === 0) {
      this.data = Array.from(this.users);
      this.ref.detectChanges();
      return;
    }
    let enableId = this.enabledLogin.map((r) => r.id);
    this.data = this.users.filter((r) => enableId.includes(r.role));
    this.ref.detectChanges();
  }

  data?: ClientUser[] = [];

  readonly columns = ['firstName', 'lastName', 'role', 'STATUS'];
}
