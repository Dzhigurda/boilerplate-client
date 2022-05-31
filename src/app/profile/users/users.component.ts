import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  Inject,
} from '@angular/core';
import { ClientUser } from 'src/app';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Role, RoleService, UserRole } from '../role.service';
import { debounceTime, forkJoin } from 'rxjs';
import { UserService } from 'src/app/user.service';
import {
  TuiAlertService,
  TuiDialogContext,
  TuiDialogService,
} from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';

export type RoleWithType = Role & { count: number };
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

  readonly roleForm = new FormGroup({
    role: new FormControl(0, Validators.required),
    userId: new FormControl(0, Validators.required),
  });
  users: ClientUser[] = [];
  roles: RoleWithType[] = [];
  rolesList: Role[] = [];
  data?: ClientUser[] = [];

  readonly columns = ['firstName', 'lastName', 'role', 'STATUS'];

  enabledLogin: RoleWithType[] = [];
  constructor(
    private roleService: RoleService,
    private userService: UserService,
    private readonly ref: ChangeDetectorRef,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(TuiAlertService) private readonly notify: TuiAlertService
  ) {}

  ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(100)).subscribe((part) => {
      console.log(part.filters);
      this.enabledLogin = part.filters;
      this.filters();
    });
    forkJoin([this.roleService.getAll(), this.userService.getAll()]).subscribe(
      ([roles, users]) => {
        this.users = users;
        this.rolesList = roles;
        this.recount();
        this.filters();
      }
    );
  }

  recount() {
    this.roles = this.rolesList.map((r) =>
      Object.assign(r, {
        count: 0,
        valueOf: function () {
          return this.count;
        },
      })
    );
    for (let i of this.users) {
      const role = this.roles.find((role) => role.id === i.role);
      role!.count += 1;
    }
    this.ref.detectChanges();
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

  @ViewChild('roleview', { static: true })
  dialogRole!: PolymorpheusContent<TuiDialogContext>;

  currentUser?: ClientUser;

  openRoleEditor(user: ClientUser) {
    this.currentUser = user;
    this.showDialog(this.dialogRole);
  }

  showDialog(content: PolymorpheusContent<TuiDialogContext>) {
    this.dialogService.open(content).subscribe();
  }
}
