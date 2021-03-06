import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Router } from '@angular/router';
import {
  TuiDialogContext,
  TuiDialogService,
  TuiNotification,
  TuiNotificationsService,
} from '@taiga-ui/core';
import { ClientUser, UserPage } from 'src/app';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';
import { Role, RoleService } from '../role.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseComponent implements OnInit {
  user?: ClientUser;
  role!: Role;

  verifyCode = new FormControl('', Validators.required);

  private notifyOptions = {
    status: TuiNotification.Error,
  };

  private notifyOptionsSuccess = {
    status: TuiNotification.Success,
  };

  @ViewChild('verifyemail', { static: true })
  dialogVerify!: PolymorpheusContent<TuiDialogContext>;

  constructor(
    private auth: AuthService,
    private roleService: RoleService,
    private userService: UserService,
    private router: Router,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private readonly ref: ChangeDetectorRef,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService
  ) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe((r) => {
      this.user = r;
      this.role = this.roleService.getOne(this.user.role);
      if (this.user.STATUS === 'CREATED') {
        /// show dialog verify
        this.showDialog(this.dialogVerify);
      }
    });
  }

  showDialog(content: PolymorpheusContent<TuiDialogContext>) {
    this.dialogService.open(content).subscribe();
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigateByUrl('/auth/login');
    });
  }

  onActivate(page: UserPage) {
    console.log('Activated', page);
    page.user = this.user!;
  }
  verify(observer: any) {
    if (!this.verifyCode.valid) {
      this.notificationsService.show('Token is not valid');
      return;
    }
    const token = this.verifyCode.value;
    this.auth.verifyAccount(token).subscribe({
      next: (res: any) => {
        if (res) {
          this.notificationsService
            .show('Your code accept', this.notifyOptionsSuccess)
            .subscribe();
          observer.complete();
          this.user!.STATUS = 'CHECKED';
          this.ref.detectChanges();
        } else {
          this.notificationsService
            .show("Your code doesn't accept", this.notifyOptions)
            .subscribe();
        }
      },
      error: (err: any) => {
        this.notificationsService
          .show("Your code doesn't accept", this.notifyOptions)
          .subscribe();
      },
    });
  }
}
