import { Component, Input, OnInit } from '@angular/core';
import { ClientUser } from 'src/app';
import { TaskPresenter } from '../Task';

@Component({
  selector: 'app-information-with-form-guest',
  templateUrl: './information-with-form-guest.component.html',
  styleUrls: ['./information-with-form-guest.component.scss']
})
export class InformationWithFormGuestComponent implements OnInit {


  @Input()
  task!: TaskPresenter;

  @Input()
  user!: ClientUser;

  @Input()
  canSeeFee = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
