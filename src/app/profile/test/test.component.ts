import { Component, Input, OnInit } from '@angular/core';
import { ClientUser, UserPage } from 'src/app';
import { UserService } from 'src/app/user.service';
import { RoleService } from '../role.service';

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

  ngOnInit(): void {}

  get role() {
    return this.roleService.getOne(this.user.role);
  }

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
