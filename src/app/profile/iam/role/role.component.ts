import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TuiAlertService, TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { Subscription } from 'rxjs';
import { ClientUser } from 'src/app';
import { RoleService, UserRole } from '../../role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleComponent implements OnInit, OnDestroy {
  @Input()
  user!: ClientUser;

  @Output()
  userChange = new EventEmitter();

  authForm: FormGroup = new FormGroup({
    role: new FormControl(null, Validators.required),
  });
  authsub!: Subscription;

  items: UserRole[] = [];

  private notifyOptions = {
    status: TuiNotification.Error,
  };

  private notifyOptionsSuccess = {
    status: TuiNotification.Success,
  };

  constructor(
    private roleService: RoleService,
    @Inject(TuiAlertService)
    private readonly notificationsService: TuiAlertService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initAuth();
    this.authsub = this.authForm.valueChanges.subscribe((part) => {
      if (!this.authForm.valid) return;
      if (part.role === this.currentRole) return;
      this.roleService.changeRole(this.user.id, part.role.id).subscribe({
        next: (r) => {
          this.user.role = part.role.id;
          this.currentRole = part.role;
          this.notificationsService
            .open('Role saved', this.notifyOptionsSuccess)
            .subscribe();
          this.userChange.emit();
          this.ref.detectChanges();
        },
        error: (er) => {
          this.notificationsService
            .open(er.error, this.notifyOptions)
            .subscribe();
          this.setDefaultRole(); 
          this.ref.detectChanges();
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.authsub.unsubscribe();
  }

  currentRole!: UserRole;
  private initAuth() {
    this.roleService.getAll().subscribe((roles) => {
      this.items = roles;
      this.currentRole = this.items.find((r) => r.id === this.user.role)!;
      this.setDefaultRole(); 
      this.ref.detectChanges();
    });
  }
  private setDefaultRole() {
    this.authForm.get('role')?.setValue(this.currentRole);
  }
}
