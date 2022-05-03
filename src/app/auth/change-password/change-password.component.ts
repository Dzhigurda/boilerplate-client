import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss', '../common.scss'],
})
export class ChangePasswordComponent implements OnInit {
  code!: string;
  userId!: string;

  registrationForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    wpassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    ad: new FormControl(false),
    keep: new FormControl(true),
  });

  private notifyOptions = {
    status: TuiNotification.Error,
  };

  private notifyOptionsSuccess = {
    status: TuiNotification.Success,
  };

  isLoading = false;
  constructor(
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.code = this.route.snapshot.paramMap.get('code')!;
    this.userId = this.route.snapshot.paramMap.get('id')!;
  }

  onClick(ev: any) {
    if (!this.registrationForm.valid) {
      if (this.registrationForm.get('password')?.errors?.['required']) {
        this.notificationsService
          .show('Password required', this.notifyOptions)
          .subscribe();
      }
      if (this.registrationForm.get('password')?.errors?.['minlength']) {
        this.notificationsService
          .show(
            'Password must be at least 6 characters long',
            this.notifyOptions
          )
          .subscribe();
      }
      if (
        this.registrationForm.get('password')?.value !=
        this.registrationForm.get('wpassword')?.value
      ) {
        this.notificationsService
          .show('The password is incorrect', this.notifyOptions)
          .subscribe();
      }
      return;
    }

    this.isLoading = true;
    this.registrationForm.disable();
    const password = this.registrationForm.get('password')!.value;
    const keep = this.registrationForm.get('keep')?.value ?? false;
    this.auth.changePassword(this.code, this.userId, password, keep).subscribe({
      next: (r) => {
        this.registrationForm.enable();
        this.isLoading = false;
        this.notificationsService
          .show('Hi ' + (r as any).user.firstName, this.notifyOptionsSuccess)
          .subscribe();
      },
      error: (err) => {
        this.registrationForm.enable();
        this.isLoading = false;
        this.notificationsService
          .show(err.error, this.notifyOptions)
          .subscribe();
      },
      complete: () => {},
    });
  }
}
