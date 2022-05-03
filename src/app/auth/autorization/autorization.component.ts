import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-autorization',
  templateUrl: './autorization.component.html',
  styleUrls: ['./autorization.component.scss', '../common.scss'],
})
export class AutorizationComponent implements OnInit {
  registrationForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.email]),
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
  isLoading = false;


  private notifyOptions = {
    status: TuiNotification.Error,
  };

  private notifyOptionsSuccess = {
    status: TuiNotification.Success,
  };


  constructor(
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {}
 
  onClick(event: MouseEvent) {
    if (!this.registrationForm.valid) {
      if (this.registrationForm.get('login')?.errors?.['required']) {
        this.notificationsService
          .show('Login required', this.notifyOptions)
          .subscribe();
      }
      if (this.registrationForm.get('login')?.errors?.['email']) {
        this.notificationsService
          .show('Login mast be your email', this.notifyOptions)
          .subscribe();
      }
      if (this.registrationForm.get('password')?.errors?.['required']) {
        this.notificationsService
          .show('Password required', this.notifyOptions)
          .subscribe();
      }
      if (this.registrationForm.get('password')?.errors?.['minlength']) {
        this.notificationsService
          .show('Password must be at least 6 characters long', this.notifyOptions)
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
    const login = this.registrationForm.get('login')?.value;
    const password = this.registrationForm.get('password')?.value;
    const keep = this.registrationForm.get('keep')?.value ?? false;
    this.auth.registration(login, password, keep).subscribe({
      next: (r) => {
        this.registrationForm.enable();
        this.isLoading = false;
        this.notificationsService
          .show(
            'Hi ' + (r as any).user.firstName,
            this.notifyOptionsSuccess
          )
          .subscribe();
      },
      error: (err) => {
        this.registrationForm.enable();
        this.isLoading = false;
        this.notificationsService.show(err.error, this.notifyOptions).subscribe();
      },
      complete: () => {},
    });
  }
}
