import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { debounceTime, Subscription } from 'rxjs';
import { ClientUser } from 'src/app';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Input()
  user!: ClientUser;
 
  userForm: FormGroup = new FormGroup({
    firstName: new FormControl('Anton', Validators.required),
    secondName: new FormControl('A', Validators.required),
    lastName: new FormControl('Dzhigurda', Validators.required),
  });
 
  usersub!: Subscription;

  private notifyOptions = {
    status: TuiNotification.Error,
  };

  private notifyOptionsSuccess = {
    status: TuiNotification.Success,
  };

  

  constructor(
    private userService: UserService, 
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {}

  ngOnInit(): void {
    this.initSettings();

    this.usersub = this.userForm.valueChanges
      .pipe(debounceTime(2000))
      .subscribe((part: any) => {
        console.log(this.userForm.valid, this.userForm.errors);
        if (!this.userForm.valid) return;
        this.user.firstName = part.firstName;
        this.user.secondName = part.secondName;
        this.user.lastName = part.lastName;
        this.userService
          .saveSetting(this.user.id, this.user)
          .subscribe((user) => {
            this.notificationsService
              .show('Setting saved', this.notifyOptionsSuccess)
              .subscribe();
          });
      });
  }

  ngOnDestroy(): void { 
    this.usersub.unsubscribe();
  }

  private initSettings() {
    this.userForm.get('firstName')?.setValue(this.user.firstName);
    this.userForm.get('secondName')?.setValue(this.user.secondName);
    this.userForm.get('lastName')?.setValue(this.user.lastName);
  }
}
