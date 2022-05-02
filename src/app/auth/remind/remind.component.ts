import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiNotificationsService } from '@taiga-ui/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-remind',
  templateUrl: './remind.component.html',
  styleUrls: ['./remind.component.scss', "../common.scss"],
})
export class RemindComponent implements OnInit {
  readonly loginForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.email]),
    keep: new FormControl(true),
  });
  isLoading = false;
  constructor(private auth: AuthService, private router: Router,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService) {}

  ngOnInit(): void {}

  onClick(ev: MouseEvent) {
    if (!this.loginForm.valid) {
      if (this.loginForm.get('login')?.errors?.['required']) {
        this.notificationsService.show('Логин обязательное поле').subscribe();
      }
      if (this.loginForm.get('login')?.errors?.['email']) {
        this.notificationsService
          .show('Логин должен быть ваш Email')
          .subscribe();
      }
      return;
    }

    this.isLoading = true;
    const login = this.loginForm.get('login')?.value;
    this.loginForm.disable();
    this.auth.remind(login).subscribe({
      next: (r) => {
        this.loginForm.enable();
        this.isLoading = false;
        this.notificationsService
          .show('На вашу почту отправлено письмо')
          .subscribe(() => { 
          });
          this.router.navigateByUrl('/auth/remind/success');
      },
      error: (err) => {
        this.loginForm.enable();
        this.isLoading = false;
        this.notificationsService.show(err.error.message).subscribe();
      },
      complete: () => {},
    });
  }
}
