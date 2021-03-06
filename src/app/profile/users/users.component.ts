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
import { debounceTime } from 'rxjs';
import { UserService } from 'src/app/user.service';
import {
  TuiDialogContext,
  TuiDialogService,
  TuiNotificationsService,
} from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';

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
  roles!: (UserRole & { count: number })[];
  data?: ClientUser[] = [];

  readonly columns = ['firstName', 'lastName', 'role', 'STATUS'];

  enabledLogin: Role[] = [];
  constructor(
    private roleService: RoleService,
    private userService: UserService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private readonly ref: ChangeDetectorRef,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService
  ) {}

  ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(100)).subscribe((part) => {
      console.log(part.filters);
      this.enabledLogin = part.filters;
      this.filters();
    });
    this.userService.getAll().subscribe((r) => {
      this.users = r;

      this.roles = this.roleService.getAll().map((r) => {
        return Object.assign(r, {
          count: 0,
          valueOf: function () {
            return this.count;
          },
        });
      });

      for (let i of this.users) {
        const role = this.roles.find((role) => role.id === i.role);
        role!.count += 1;
      }
      this.filters();
    });
  }

  recount() {
    for (let role of this.roles) {
      role!.count = 0;
    }
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
