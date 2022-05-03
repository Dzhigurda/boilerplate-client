import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-two-factor-authenticator',
  templateUrl: './two-factor-authenticator.component.html',
  styleUrls: ['./two-factor-authenticator.component.scss', '../common.scss'],
})
export class TwoFactorAuthenticatorComponent implements OnInit {
  readonly loginForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    keep: new FormControl(true),
    token: new FormControl('', [Validators.required, Validators.minLength(6)]),
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

  ngOnInit(): void {
    const ctx = this.auth.getContext();
    if (!ctx) {
      this.router.navigateByUrl('/auth/login');
      return;
    }
    const { login, password, keep } = ctx;
    this.loginForm.get('login')?.setValue(login);
    this.loginForm.get('password')?.setValue(password);
    this.loginForm.get('keep')?.setValue(keep);
    this.loginForm.valueChanges.subscribe((r) => {
      if (this.loginForm.get('token')?.value?.length == 6 && !this.isLoading) {
        this.login();
      }
    });
  }

  login() {
    this.isLoading = true;
    console.log('2FA login');
    const login = this.loginForm.get('login')?.value;
    const password = this.loginForm.get('password')?.value;
    const keep = this.loginForm.get('keep')?.value ?? false;
    const token = this.loginForm.get('token')?.value;
    if (!this.loginForm.valid) {
      console.log(this.loginForm.errors, this.loginForm.valid);
      this.notificationsService.show('Check form', this.notifyOptions).subscribe();
      return;
    }

    this.loginForm.disable();
    this.auth.logIn(login, password, keep, token).subscribe({
      next: (r) => {
        this.loginForm.enable();
        this.isLoading = false;
        this.notificationsService
          .show('Приветствую ' + (r as any).user.firstName, this.notifyOptionsSuccess)
          .subscribe();
      },
      error: (err) => {
        this.loginForm.enable();
        this.isLoading = false;
        console.log('error code:', err.status);
        this.notificationsService.show("Not match, check your code", this.notifyOptions).subscribe();
      },
      complete: () => {},
    });
  }
}
