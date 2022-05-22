import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  TuiDialogContext,
  TuiDialogService,
  TuiNotification,
  TuiNotificationsService,
} from '@taiga-ui/core';
import { ClientUser } from 'src/app';
import { AuthService } from 'src/app/auth.service';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Subscription } from 'rxjs';
import { TuiMobileDialogService } from '@taiga-ui/addon-mobile';

export type AUTH = 'WITHOUT_2FA' | 'WITHIN_2FA';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  @Input()
  user!: ClientUser;

  loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    wpassword: new FormControl('', Validators.required),
  });

  tokenController = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  login?: { login: string; loginType: string };
  isLoading = true;
  isEnable = true;

  qr!: string;
  qrId!: number;
  codes!: string[];

  isEnable2FA?: AUTH;

  private notifyOptions = {
    status: TuiNotification.Error,
  };

  private notifyOptionsSuccess = {
    status: TuiNotification.Success,
  };
  constructor(
    private ref: ChangeDetectorRef,
    private auth: AuthService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private readonly dialogsService: TuiMobileDialogService
  ) {}

  ngOnInit(): void {
    this.auth.getLogin(this.user.id).subscribe({
      next: (login: any) => {
        this.login = login;

        this.isEnable = true;
        this.loginForm.get('login')?.setValue(this.login?.login);
        this.loginForm.get('login')?.disable();
      },
      error: (er) => {
        this.isEnable = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });

    this.auth.isEnable2FA().subscribe((r) => {
      console.log(this.isEnable2FA);
      this.isEnable2FA = r ? 'WITHIN_2FA' : 'WITHOUT_2FA';
      console.log(this.isEnable2FA);
      this.ref.detectChanges();
    });
  }

  async copyCodes(observer: any) {
    // copy this.codes
    const text = this.codes.join();
    await navigator.clipboard.writeText(text);

    this.notificationsService.show('You copied tokens').subscribe();
    observer.complete();
  }
  showDialog(content: PolymorpheusContent<TuiDialogContext>) {
    this.dialogService.open(content).subscribe();
  }

  show2FADialog(content: PolymorpheusContent<TuiDialogContext>) {
    this.auth.getReserveCodes().subscribe((codes: string[]) => {
      this.codes = codes;
      this.showDialog(content);
    });
  }
  private tokenSub?: Subscription;
  show2FAEnable(content: any, next: any) {
    if (this.tokenSub) {
      this.tokenSub.unsubscribe();
    }

    this.auth.get2FAQRURL().subscribe((r) => {
      const observer = this.dialogService.open(content).subscribe();

      this.tokenSub = this.tokenController.valueChanges.subscribe((r) => {
        if (!this.tokenController.valid) return;
        this.enable2FA(observer, next);
      });

      this.qr = r.qr;
      this.qrId = r.id;
    });
  }
  save(observer: any) {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.errors);
      this.notificationsService.show('Error', this.notifyOptions).subscribe();
      return;
    }
    if (
      this.loginForm.get('password')?.value !=
      this.loginForm.get('wpassword')?.value
    ) {
      this.notificationsService
        .show('Not match', this.notifyOptions)
        .subscribe();
      return;
    }
    this.auth.setPassword(this.loginForm.get('password')!.value).subscribe({
      next: (res: any) => {
        this.notificationsService
          .show('Saved', this.notifyOptionsSuccess)
          .subscribe();
        observer.complete();
      },
      error: (err: any) => {
        this.notificationsService
          .show("Doesn't saved", this.notifyOptions)
          .subscribe();
      },
    });
  }

  enable2FA(observer: any, content: PolymorpheusContent<TuiDialogContext>) {
    if (!this.tokenController.valid) {
      this.notificationsService.show('Token is not valid');
      return;
    }
    const token = this.tokenController.value;
    this.auth.enable2FA(token).subscribe({
      next: (res: any) => {
        this.notificationsService
          .show('2FA enabled', this.notifyOptionsSuccess)
          .subscribe();
        observer.complete();
        this.show2FADialog(content);
        this.isEnable2FA = 'WITHIN_2FA';
        this.ref.detectChanges();
      },
      error: (err: any) => {
        this.notificationsService
          .show("2FA doesn't enabled", this.notifyOptions)
          .subscribe();
      },
    });
  }

  disable2FA() {
    this.dialogsService
      .open('Do you want to disable 2FA?', {
        label: 'Are you sure',
        actions: ['Yes', 'Cancel'],
      })
      .subscribe((index: number) => {
        if (index != 0) return;
        this.auth.disable2FA().subscribe({
          next: (res: any) => {
            this.notificationsService
              .show('2FA disabled', this.notifyOptionsSuccess)
              .subscribe();

            this.codes = [];
            this.isEnable2FA = 'WITHOUT_2FA';
            this.ref.detectChanges();
          },
          error: (err: any) => {
            this.notificationsService
              .show("2FA doesn't disabled", this.notifyOptions)
              .subscribe();
          },
        });
      });
  }

  openForm() {
    this.isEnable = !this.isEnable;
  }
  closeForm() {
    this.isEnable = !this.isEnable;
  }
}
