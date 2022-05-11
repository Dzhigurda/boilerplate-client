import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ClientUser, UserPage } from 'src/app';
import { UserService } from 'src/app/user.service';
import { Role, RoleService } from '../role.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit, UserPage {
  @Input()
  user!: ClientUser;

  constructor(
    private userService: UserService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
     this.roleService.getOne(this.user.role).subscribe(r => {
      this.role = r;
     });
  }
 
  role?: Role;

  getStatusIcon() {
    switch (this.user.STATUS) {
      case 'CREATED':
        return 'tuiIconCancel';
      case 'CHECKED':
        return 'tuiIconDone';
      case 'DELETED':
        return 'tuiIconTrash';
      default:
        return 'tuiIconTooltip';
    }
  }
}
