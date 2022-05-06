import { Component, Input, OnInit } from '@angular/core';
import { ClientUser } from 'src/app';
import { ClientUserTumbanian, TaskPresenter } from '../Task';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {

  @Input()
  task!: TaskPresenter;

  @Input()
  user!: ClientUser;
  constructor() { }

  ngOnInit(): void {
  }

  publish() {
    /// 
    this.task?.publish(this.user);
  }
  unpublish() {
    //
    this.task?.unpublish(this.user);
  }
  accept() {
    // TODO Должность, сервис сохранения
    this.task?.setAuthor(new ClientUserTumbanian().restore(this.user, "Автор"));
    this.task?.distribute(this.user);
  }

  refuse() {
    // 
    this.task?.refuse(this.user);
  }
  sendToResolve() {
    //
    this.task?.sendToResolve(this.user);
  }
  revision() {
    // 
    this.task?.revision(this.user);
  } 
  reject() {
    //
    this.task?.reject(this.user);
  }
  resolve() {
    //
    this.task?.resolve(this.user);
  }
  end() {
    //
    this.task?.end(this.user);
  }
  cancel() {
    //
    this.task?.cancel(this.user);
  }
  archive() {
    //
    this.task?.archive(this.user);
  }
}
