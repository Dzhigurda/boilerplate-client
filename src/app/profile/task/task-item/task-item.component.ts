import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskPresenter } from '../Task';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {

  @Input()
  task!: TaskPresenter

  @Output()
  select = new EventEmitter<TaskPresenter>();

  @Input()
  isActive = false;

  @Input()
  canSeeFee = false;

  constructor() { }

  ngOnInit(): void {
  }
 
}
