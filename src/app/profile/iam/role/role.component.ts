import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { debounceTime, Subscription } from 'rxjs';
import { ClientUser } from 'src/app';
import { Role, RoleService } from '../../role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, OnDestroy {

  @Input()
  user!: ClientUser;
  
  authForm: FormGroup = new FormGroup({
    role: new FormControl(null, Validators.required),
  });
  authsub!: Subscription;


  items: Role[] = [];
  
  private notifyOptions = {
    status: TuiNotification.Error,
  };

  private notifyOptionsSuccess = {
    status: TuiNotification.Success,
  };

  constructor( 
    private roleService: RoleService, 
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {}

  ngOnInit(): void {
    this.initAuth();
    this.authsub = this.authForm.valueChanges
    .pipe(debounceTime(2000))
    .subscribe((part) => {
      console.log(this.authForm.valid, this.authForm.errors);
      if (!this.authForm.valid) return;
      if (part.role === this.oldRole) return;
      this.roleService.changeRole(this.user.id, part.role.id).subscribe({
        next: (r) => {
          this.user.role = part.role.id;
          this.oldRole = part.role;
          this.notificationsService
            .show('Role saved', this.notifyOptionsSuccess)
            .subscribe();
        },
        error: (er) => {
          console.log(er);
          this.notificationsService
            .show(er.error, this.notifyOptions)
            .subscribe();
          this.setDefaultRole();
        },
      });
    });
  }
 
  ngOnDestroy(): void {
    this.authsub.unsubscribe(); 
  }


  oldRole: any;
  private initAuth() {
    this.items = this.roleService.getAll();
    this.oldRole = this.items.find((r) => r.id === this.user.role);
    this.setDefaultRole();
  }
  private setDefaultRole() {
    this.authForm.get('role')?.setValue(this.oldRole);
  }

}
