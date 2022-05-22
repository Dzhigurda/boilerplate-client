import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../common.scss'],
})
export class LoginComponent implements OnInit {
  readonly loginForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    keep: new FormControl(true),
  });

  isLoading = false;

  private notifyOptions = {
    status: TuiNotification.Error,
  };

  private notifyOptionsSuccess = {
    status: TuiNotification.Success,
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {}

  ngOnInit(): void {}

  onClick(ev: MouseEvent) {
    if (!this.loginForm.valid) {
      if (this.loginForm.get('login')?.errors?.['required']) {
        this.notificationsService
          .show('Login required', this.notifyOptions)
          .subscribe();
      }
      if (this.loginForm.get('login')?.errors?.['email']) {
        this.notificationsService
          .show('Login mast be your email', this.notifyOptions)
          .subscribe();
      }
      return;
    }

    this.isLoading = true;
    const login = this.loginForm.get('login')?.value;
    const password = this.loginForm.get('password')?.value;
    const keep = this.loginForm.get('keep')?.value ?? false;
    this.loginForm.disable();
    this.auth.logIn(login, password, keep).subscribe({
      next: (r) => {
        this.loginForm.enable();
        this.isLoading = false;
        this.notificationsService
          .show('Hi ' + (r as any).user.firstName, this.notifyOptionsSuccess)
          .subscribe();
      },
      error: (err) => {
        this.loginForm.enable();
        this.isLoading = false;
        console.log('error code:', err.status);
        if (err.status === 403) {
          this.notificationsService
            .show('You need to get a User token in Google Authenticator')
            .subscribe();
          this.auth.saveContext(login, password, keep);
          this.router.navigateByUrl('/auth/2fa');
        } else {
          this.notificationsService
            .show(err.error, this.notifyOptions)
            .subscribe();
        }
      },
      complete: () => {},
    });
    console.log('LOG');
  }
}
