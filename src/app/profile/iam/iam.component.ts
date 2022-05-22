import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClientUser, UserPage } from 'src/app';

@Component({
  selector: 'app-iam',
  templateUrl: './iam.component.html',
  styleUrls: ['./iam.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamComponent implements OnInit, UserPage {
  @Input()
  user!: ClientUser;

  contacts: FormGroup[] = [];

  constructor() {} 

  ngOnInit(): void {}
}
