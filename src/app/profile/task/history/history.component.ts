import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { TuiTbodyComponent } from '@taiga-ui/addon-table';
import { TaskPresenter } from '../Task';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  @Input()
  task!: TaskPresenter;
 
  get history() {
    return this.task.history;
  };
  readonly columns = ['date', 'name', 'status' ];

  constructor(private ref: ChangeDetectorRef) { }

  @ViewChild("table", {static: true})
  table!: TuiTbodyComponent<any>;
  ngOnInit(): void { 
  }

}
