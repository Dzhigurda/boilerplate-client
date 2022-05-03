import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { TuiMobileDialogService } from '@taiga-ui/addon-mobile';
import { TuiNotificationsService } from '@taiga-ui/core';
import { ClientUser } from 'src/app';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent implements OnInit {
  @Input()
  user!: ClientUser;

  constructor(
    private ref: ChangeDetectorRef,
    private readonly authService: AuthService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private readonly dialogsService: TuiMobileDialogService
  ) {}

  ngOnInit(): void {}

  remove() {
    this.dialogsService
      .open('Do you want to remove this account?', {
        label: 'Are you sure',
        actions: ['Yes', 'Cancel'],
      })
      .subscribe((index) => {
        if (index !== 0) return;
        this.authService.remove().subscribe((r) => {
          if (r) {
            this.user.STATUS = 'DELETED';
          }
          this.notificationsService.show('You have been removed').subscribe();
          this.ref.detectChanges();
        });
      });
  }

  delete() {
    this.dialogsService
      .open('Do you want to delete this account?', {
        label: 'Are you sure',
        actions: ['Yes', 'Cancel'],
      })
      .subscribe((index) => {
        if (index !== 0) return;
        this.authService.delete().subscribe((r) => {
          if (r) {
            this.authService.logout();
          }
          this.notificationsService.show('You have been deleted').subscribe();
          this.ref.detectChanges();
        });
      });
  }

  recover() {
    this.dialogsService
      .open('Do you want to recover this account?', {
        label: 'Are you sure',
        actions: ['Yes', 'Cancel'],
      })
      .subscribe((index) => {
        if (index !== 0) return;
        this.authService.recover().subscribe((r) => {
          if (r) {
            // any update user
            this.user.STATUS = 'CREATED';
          }
          this.notificationsService.show('You have been recovered').subscribe();
          this.ref.detectChanges();
        });
      });
  }
}
