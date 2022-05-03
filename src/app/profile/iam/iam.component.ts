import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientUser, UserPage } from 'src/app';
import { UserContactDTO } from '../../../../../server/src/domains/user';
import { ContactService } from './contact.service';

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
